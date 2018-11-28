<template>
    <ul class="folFil">
        <li v-for="(e, i) in dirContent" :key="i" @click="clck(e, i)" @dblclick="dbClck(e)" :class="e.selected?'selected':''">
            <div>
                <img v-if="e.type == 'directory'" src="./../assets/Folder.svg" alt="">
                <img v-else src="./../assets/File.svg" alt="">
            </div>
            <span>{{e.name}}</span>
        </li>
    </ul>
</template>
<script>
export default {
  name: 'Main',
  props: [
    'dir',
    'dirContent',
    'history',
    'historyIndex'
  ],
  data () {
    return {
      last: 0
    }
  },
  methods: {
    clck (e, i) {
      this.dirContent[this.last].selected = false
      this.last = i
      e.selected = true
    },
    dbClck (e) {
      this.$parent.$emit('openFolder', (e))
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
        display: inline-block;
        width: 100px;
        overflow: hidden;
        padding: 5px;
        >div{
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
      > span {
        overflow-x: auto;
        text-overflow: initial;
      }
      &:active{
        background: #cce8ff;
      }
    }
}
</style>
