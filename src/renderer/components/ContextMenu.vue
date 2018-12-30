<template>
    <ul class="contentMenu" :style="'top:'+yCord+'px;left:'+xCord+'px;'">
      <li @click="open()">Abrir</li>
      <li @click="rename()">Renombrar</li>
      <li @click="copy()">Copiar</li>
      <!-- <li @click="cut()">Cortar</li>  -->
      <li @click="del()">Eliminar</li>
    </ul>
</template>
<script>
export default {
  name: 'ContextMenu',
  props: [
    'element',
    'y',
    'x',
    'index'
  ],
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    yCord () {
      return window.innerHeight - this.y <= 105 ? this.y - 105 : this.y
    },
    xCord () {
      return window.innerWidth - this.x <= 150 ? this.x - 150 : this.x
    }
  },
  methods: {
    open () {
      if (this.element.type === 'file') {
        this.$parent.$emit('openFile', (this.element))
      } else {
        this.$parent.$parent.$emit('openFolder', (this.element))
      }
    },
    rename () {
      this.$parent.$parent.$emit('rename', (this.element, this.index))
    },
    copy () {
      this.$parent.$parent.$emit('copy', (this.element))
    },
    cut () {
    },
    del () {
      this.$parent.$parent.$emit('deleteFolder', (this.element))
    }
  }
}
</script>
<style lang="scss" scoped>
  .contentMenu {
    background-color: #E1E1E1;
    border: 2px solid rgb(163, 163, 163);
    min-width: 150px;
    position: fixed;
    z-index: 999;
    padding: 0;
    margin: 0;
    >li{
      list-style: none;
      padding: 5px;
      font-size: 10pt;
      cursor: default;
      &:hover{
        background: rgb(209, 209, 209);
      }
    }
  }
</style>