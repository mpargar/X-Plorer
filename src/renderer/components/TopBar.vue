<template>
  <div id="TopBar">
    <ul class="btns">
      <li @click="back()">◂</li>
      <li @click="front()">▸</li>
      <li @click="up()">▴</li>
    </ul>
    <ul class="dir">
      <li v-for="(e, i) in dir" :key="i">
        {{ e }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TopBar',
  props: [
    'dir',
    'dirContent',
    'history',
    'historyIndex'
  ],
  methods: {
    back () {
      this.$parent.$emit('historyBack')
    },
    front () {
      this.$parent.$emit('historyFront')
    },
    up () {
      this.$parent.$emit('upDirectory')
    }
  }
}
</script>
<style lang="scss" scoped>
  #TopBar {
    background: #E1E1E1;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 5px;
    > ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
    }
    .btns {
      width: 100px;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      padding-right: 10px;
      >li{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
        border: 1px solid transparent;
        &:hover{
          background: #e5f3ff;
          border-color:#cce8ff;
        }
        &:active{
          background: #cce8ff;
        }
      }
    }
    .dir {
      width: 100%;
      align-items: center;
      background: white;
      overflow-x: auto;
      >li{
        border: 1px transparent solid;
        padding: 5px 3px;
        cursor: default;
        white-space: nowrap;
        &:not(:last-child){
          &:after{
            /* content: "▶" */
            content: ">"
          }
        }
        &:hover{
          background: #e5f3ff;
          border: 1px solid #cce8ff;
        }
        &:active{
          background: #cce8ff;
        }
      }
    }
  }
</style>

