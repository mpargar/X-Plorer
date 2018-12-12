<template>
    <ul class="folFil">
        <li v-for="(e, i) in dirContent" :key="i" @contextmenu="ctxMenu(e, i, $event)" @click="clck(e, i)" @dblclick="dbClck(e)" :class="e.selected?'selected':''">
            <div class="icon">
                <img v-if="e.type == 'directory'" src="./../assets/Folder.svg" alt="">
                <img v-else src="./../assets/File.svg" alt="">
            </div>
            <span v-if="!e.edit">{{e.name}}</span>
            <span v-else><input type="text" :value="e.name"></span>
            <context-menu v-if="e.contextMenu"
              :element="e"
              :index="i"
              :y="y"
              :x="x"/>
        </li>
    </ul>
</template>
<script>
import ContextMenu from '@/components/ContextMenu'
export default {
  name: 'Main',
  props: [
    'dir',
    'dirContent',
    'history',
    'historyIndex'
  ],
  components: {
    ContextMenu
  },
  data () {
    return {
      last: 0,
      y: undefined,
      x: undefined
    }
  },
  methods: {
    clck (e, i) {
      if (this.dirContent[this.last]) {
        this.dirContent[this.last].selected = false
        this.dirContent[this.last].contextMenu = false
      }
      this.last = i
      e.selected = true
    },
    dbClck (e) {
      if (e.type === 'file') {
        this.$parent.$emit('openFile', (e))
      } else {
        this.$parent.$emit('openFolder', (e))
      }
    },
    ctxMenu (e, i, event) {
      this.y = event.clientY
      this.x = event.clientX
      this.clck(e, i)
      e.contextMenu = true
    }
  }
}
</script>
<style lang="scss" scoped>
.folFil{
    list-style: none;
    padding: 10px;
    overflow: scroll;
    height: 100%;
    >li{
        position: relative;
        display: inline-block;
        width: 100px;
        overflow: hidden;
        padding: 5px;
        >.icon{
            height: 100%;
            width: 100%;
            white-space: nowrap;
            text-align: center;
            >img{
                width: 100%;
                max-height: 30px;
            }
        }
        >span{
            text-align: center;
            white-space: nowrap;
            display: block;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: default;
        }
    }
    .selected {
      background: #e5f3ff;
      border-color:#cce8ff;
      &:active{
        background: #cce8ff;
      }
    }
}
</style>
