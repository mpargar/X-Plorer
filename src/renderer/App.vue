<template>
  <div id="app">
      <top-bar></top-bar>
      <ul class="main">
        <li>
          
        </li>
        <li>

        </li>
      </ul>
  </div>
</template>

<script>
  import SideBar from '@/components/SideBar'
  import TopBar from '@/components/TopBar'
  export default {
    name: 'X-Plorer',
    components: {
      TopBar,
      SideBar
    },
    data () {
      return {
        uri: '/Users/miguelparra'
      }
    }
  }
</script>

<style lang="scss">
  *{
    padding: 0;
    margin: 0;
  }
  #app{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .main{
      height: 100%;
      width: 100%;
      list-style: none;
      display: flex;
      >li{
        &:first-child{
          width: 20%;
          background: blue;
        }
        &:last-child{
          width: 80%;
          background: red;
        }
      }
    }
  }
</style>
