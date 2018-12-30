<template>
  <div id="app">
    <!-- TOP BAR -->
      <top-bar
        :dir="dir"
        :history="history"
        :historyIndex="historyIndex"/>
      <ul class="main">
        <!-- <li>
          
        </li> -->
        <li>
          <!-- MAIN -->
          <folders-files
            :dir="dir"
            :dirContent="dirContent"
            :history="history"
            :historyIndex="historyIndex">
          </folders-files>
        </li>
      </ul>
      <!-- Rename -->
      <div class="renameBox" v-if="renameBool">
        <div>
          <div class="title">Renombrar</div>
          <input v-model="renameBox">
          <div class="btns">
            <button @click="rename()">Ok</button>
            <button @click="renameCancel()">Cancel</button>
          </div>
        </div>
      </div>
      <!-- Create Folder/File -->
      <div class="renameBox" v-if="newFilFol">
        <div>
          <div class="title">
            Crear {{ newFilFolType ? 'Archivo' : 'Folder' }}
          </div>
          <input v-model="newFilFolName">
          <div class="btns">
            <button @click="newFilFolOk()">Ok</button>
            <button @click="newFilFolCancel()">Cancel</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import SideBar from '@/components/SideBar'
  import TopBar from '@/components/TopBar'
  import FoldersFiles from '@/components/FoldersFiles'
  const Os = require('os') // Acceder ainformación del SO
  const Fs = require('fs') // File System
  const FsE = require('fs-extra') // Complemento de File System
  const Shell = require('electron').shell // Controla y emula la shell
  const Path = require('path') // Formateo de rutas
  const Rimraf = require('rimraf') // Libreria que elimina (rm -rf)
  export default {
    name: 'X-Plorer',
    components: {
      TopBar,
      SideBar,
      FoldersFiles
    },
    data () {
      return {
        user: Os.userInfo().username,
        dir: ['C:', 'Users', Os.userInfo().username],
        dirContent: [],
        history: [],
        historyIndex: 0,
        renameBox: '',
        lastName: '',
        renameBool: false,
        newFilFol: false,
        newFilFolName: '',
        newFilFolType: false,
        copyDir: '',
        copyDirName: '',
        copyDirType: ''
      }
    },
    created () {
      /* Put on history */
      this.history.push(Object.assign([], this.dir))
      /* Get folders */
      let folFil = Fs.readdirSync(this.dir.join('/')).map((file) => {
        return (Fs.statSync(this.dir.join('/') + '/' + file).isDirectory()) ? ({name: file, type: 'directory'}) : ({name: file, type: 'file'})
      })
      folFil.forEach((e, i) => {
        this.$set(this.dirContent, i, {})
        this.$set(this.dirContent[i], 'name', e.name)
        this.$set(this.dirContent[i], 'type', e.type)
        this.$set(this.dirContent[i], 'selected', false)
        this.$set(this.dirContent[i], 'contextMenu', false)
        this.$set(this.dirContent[i], 'edit', false)
      })
      /* ON */
      this.$on('historyBack', (e) => {
        if (this.historyIndex > 0) {
          this.historyIndex--
          this.dir = this.history[this.historyIndex]
        }
      })
      this.$on('historyFront', (e) => {
        if (this.historyIndex + 1 < this.history.length) {
          this.historyIndex++
          this.dir = this.history[this.historyIndex]
        }
      })
      this.$on('upDirectory', (e) => {
        if (this.dir.length > 1) {
          if (this.history.length - 1 > this.historyIndex) {
            this.history = this.history.slice(0, this.historyIndex + 1)
          }
          this.dir = this.dir.slice(0, this.dir.length - 1)
          this.history.push(Object.assign([], this.dir))
          this.historyIndex++
        }
      })
      this.$on('openFolder', (e) => {
        if (this.history.length - 1 > this.historyIndex) {
          this.history = this.history.slice(0, this.historyIndex + 1)
          this.dir = this.history[this.history.last]
          console.log(this.dir)
        }
        this.$set(this.dir, this.dir.length, e.name)
        this.history.push(Object.assign([], this.dir))
        this.historyIndex++
      })
      this.$on('openFile', (e) => {
        Shell.openItem(Path.join(this.dir.join('/'), e.name))
      })
      this.$on('deleteFolder', (e) => { // Delete folder and files
        if (e.type === 'file') {
          Fs.unlink(this.dir.join('/') + '/' + e.name, (err) => {
            if (!err) {
              let backup = this.dir
              this.dir = []
              this.dir = backup
            } else {
            }
          })
        } else {
          Rimraf(this.dir.join('/') + '/' + e.name, () => {
            let backup = this.dir
            this.dir = []
            this.dir = backup
          })
        }
      })
      this.$on('rename', (el, i) => {
        this.renameBool = true
        let tmp = this.dirContent[el].name // Guardo el nombre del archivo (No reactivamente)
        this.renameBox = tmp // Se la doy al a la caja
        this.lastName = tmp // Se la doy al respaldo
      })
      this.$on('createFilFol', (isFile) => {
        this.newFilFol = true
        this.newFilFolName = ''
        this.newFilFolType = isFile
      })
      this.$on('copy', (element) => {
        this.copyDir = this.dir.join('/') + '/' + element.name
        this.copyDirType = element.type
        this.copyDirName = element.name
      })
      this.$on('paste', () => {
        /* Existe una dirección a copiar */
        if (this.copyDir) {
          /* Folder */
          if (this.copyDirType === 'directory') {
            /* Crear folder del mismo nombre */
            Fs.mkdir(this.dir.join('/') + '/' + this.copyDirName, (err) => {
              if (!err) {
                /* Copiar contenido */
                FsE.copy(this.copyDir, this.dir.join('/') + '/' + this.copyDirName, err => {
                  if (err) return console.error(err)
                  let backup = this.dir
                  this.dir = []
                  this.dir = backup
                })
              }
            })
          } else {
            Fs.copyFile(this.copyDir, this.dir.join('/') + '/' + this.copyDirName, (err) => {
              if (err) throw err
              let backup = this.dir
              this.dir = []
              this.dir = backup
            })
          }
        }
      })
    },
    methods: {
      rename () {
        Fs.rename(this.dir.join('/') + '/' + this.lastName, this.dir.join('/') + '/' + this.renameBox, (err) => {
          if (err) {
          } else {
            /* Actualiza la pantalla main */
            let backup = this.dir
            this.dir = []
            this.dir = backup
          }
          this.renameBool = false // Oculta el input
        })
      },
      renameCancel () {
        this.renameBool = false
      },
      newFilFolOk () {
        if (this.newFilFolType) {
          /* Si es verdadero se ejecuta el codigo de nuevo archivo */
          try {
            Fs.writeFileSync(this.dir.join('/') + '/' + this.newFilFolName, '', 'utf-8')
            let backup = this.dir
            this.dir = []
            this.dir = backup
            this.newFilFol = false
          } catch (error) {
            console.log('ERROR --> ', error)
          }
        } else {
          /* Si es falso se ejecuta el codigo de nuevo folder */
          Fs.mkdir(this.dir.join('/') + '/' + this.newFilFolName, (err) => {
            if (!err) {
              let backup = this.dir
              this.dir = []
              this.dir = backup
              this.newFilFol = false
            }
          })
        }
      },
      newFilFolCancel () {
        this.newFilFol = false
      }
    },
    watch: {
      dir () {
        this.dirContent = [] // Se vacía dir contentent
        /* Get folders */
        let folFil = Fs.readdirSync(this.dir.join('/')).filter(e => e !== 'hiberfil.sys' && e !== 'pagefile.sys' && e !== 'Recovery' && e !== 'swapfile.sys' && e !== 'System Volume Information').map((file) => {
          return (Fs.statSync(this.dir.join('/') + '/' + file).isDirectory()) ? ({name: file, type: 'directory'}) : ({name: file, type: 'file'})
        })
        folFil.forEach((e, i) => {
          this.$set(this.dirContent, i, {})
          this.$set(this.dirContent[i], 'name', e.name)
          this.$set(this.dirContent[i], 'type', e.type)
          this.$set(this.dirContent[i], 'selected', false)
          this.$set(this.dirContent[i], 'contextMenu', false)
        })
      }
    }
  }
</script>

<style lang="scss">
  $main: #E1E1E1;
  $darkMain: #AEAEAE;
  .renameBox{
    background-color: rgba(0, 0, 0, 0.483);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    z-index: 999998;
    justify-content: center;
    align-items: center;
    >div{
      position: fixed;
      background: $main;
      border: 1px solid $darkMain;
      z-index: 999999;
      padding: 5px;
      display: flex;
      flex-direction: column;
      width: 300px;
      input{
        padding: 5px;
        margin: 5px auto;
        width: 285px;
      }
      .title {
        background-color: $darkMain;
        text-align: center;
        padding: 5px 0;
      }
      .btns{
        display: flex;
        >button{
          width: 100%;
          &:first-child{
            margin-right: 5px;
          }
        }
      }
    }
  }
  *{
    padding: 0;
    margin: 0;
    user-select: none;
    font-family: 'Courier New', Courier, monospace;
    font-weight: normal;
  }

  #app{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .main{
      height: 100%;
      width: 100%;
      list-style: none;
      display: flex;
      >li{
        &:first-child{
          width: 20%;
        }
        &:last-child{
          width: 100%;
          border-left: 1px solid #f7f7f7;
        }
      }
    }
  }
</style>