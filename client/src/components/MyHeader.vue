<template>
  <div>
    <nav class="navbar is-transparent header">
      <div class="navbar-brand">
        <a class="navbar-item is-primary app-name">
          Traceroute Map
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">
          <a class="navbar-item menu" @click="sourcesModal.opened = true">
            <span class="nav-icon"><icon name="cog"></icon></span>Sources
          </a>
        </div>
      </div>
    </nav>

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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
  background-color: black;

  .app-name {
    color: white;
    font-weight: bold;
    font-size: 20px;
    margin: auto;
  }

  .menu {
    color: white;

    .nav-icon {
      position: relative;
      top: 4px;
      right: 5px;
    }
  }

  a:hover {
    color: #eeeeee;
  }
}
</style>
