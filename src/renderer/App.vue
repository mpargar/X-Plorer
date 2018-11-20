<template>
  <div id="app">
      <top-bar
        :dir="dir"
        :history="history"
        :historyIndex="historyIndex"></top-bar>
      <ul class="main">
        <li>
          
        </li>
        <li>
          <folders-files
            :dir="dir"
            :dirContent="dirContent"
            :history="history"
            :historyIndex="historyIndex">
          </folders-files>
        </li>
      </ul>
  </div>
</template>

<script>
  import SideBar from '@/components/SideBar'
  import TopBar from '@/components/TopBar'
  import FoldersFiles from '@/components/FoldersFiles'
  const Os = require('os')
  const Fs = require('fs')
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
        historyIndex: 0
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
      })
      /* ON */
      this.$on('indexup', (e) => {
        this.historyIndex++
      })
      this.$on('historyBack', (e) => {
        if(this.historyIndex > 0){
          
        }
      })
    },
    watch: {
      dir () {
        /* Get folders */
        this.dirContent = []
        let folFil = Fs.readdirSync(this.dir.join('/')).map((file) => {
          return (Fs.statSync(this.dir.join('/') + '/' + file).isDirectory()) ? ({name: file, type: 'directory'}) : ({name: file, type: 'file'})
        })
        folFil.forEach((e, i) => {
          this.$set(this.dirContent, i, {})
          this.$set(this.dirContent[i], 'name', e.name)
          this.$set(this.dirContent[i], 'type', e.type)
          this.$set(this.dirContent[i], 'selected', false)
        })
      }
    }
  }
</script>

<style lang="scss">
  $main: #E1E1E1;
  $darkMain: #AEAEAE;

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
          width: 80%;
          border-left: 1px solid #f7f7f7;
        }
      }
    }
  }
</style>