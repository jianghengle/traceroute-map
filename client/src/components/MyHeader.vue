<template>
  <div>
    <div class="header">
      <div class="app-name">
        Traceroute Map
      </div>

      <div class="menu">
        <a class="item-link" href="https://github.com/jianghengle/traceroute-map">
          <icon name="github" scale="1.3" class="item-icon"></icon>
        </a>
        <a class="item-link" @click="toggleSidebar">
          <icon name="columns" scale="1.3" class="item-icon"></icon>
        </a>
        <a class="item-link" @click="sourcesModal.opened = true">
          <icon name="cog" scale="1.3" class="item-icon"></icon>
        </a>
      </div>
    </div>

    <sources-modal
      :opened="sourcesModal.opened"
      @close-sources-modal="sourcesModal.opened = false">
    </sources-modal>
  </div>
</template>

<script>
import SourcesModal from './SourcesModal'

export default {
  name: 'my-header',
  components: {
    SourcesModal
  },
  data () {
    return {
      sourcesModal: {
        opened: false
      }
    }
  },
  methods: {
    toggleSidebar () {
      this.$store.commit('toggleSidebar')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
  height: 52px;
  width: 100%;
  background-color: black;
  padding-left: 16px;
  padding-right: 16px;

  .app-name {
    color: white;
    font-weight: bold;
    font-size: 20px;
    line-height: 52px;
    float:left;
  }

  .menu {
    float: right;
    height: 100%;

    .item-link {
      display: inline-block;
      color: white;
      min-width: 30px;
      text-align: center;
      line-height: 52px;
      margin-left: 10px;

      .item-icon {
        position: relative;
        top: 6px;
      }
    }

    .item-link:hover {
      color: #eeeeee;
    }
  }
}
</style>
