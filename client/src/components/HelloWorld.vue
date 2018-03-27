<template>
  <div class="hello">
    <nav class="navbar is-transparent header">
      <div class="navbar-brand">
        <router-link class="navbar-item is-primary app-name" :to="'/'">
          Traceroute Map
        </router-link>
      </div>

      <div class="navbar-menu is-active">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">
          <a class="navbar-item menu">
            <span class="nav-icon"><icon name="cog"></icon></span>Settings
          </a>
        </div>
      </div>
    </nav>

    <div class="main-body">
      <gmap-map
        :center="mapCenter"
        :zoom="5"
        :options="{scrollwheel: false}"
        style="width: 100%; height: 600px">
      </gmap-map>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Traceroute Map</strong> the source code is public at
            <a href="https://github.com/jianghengle/traceroute-map">
              <span class="inline-icon"><icon name="github"></icon></span>Github
            </a>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      mapCenter: {lat: 40.8186, lng: -96.7100}
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

    a:hover {
      color: #EEEEEE;
    }
  }
}

.inline-icon {
  position: relative;
  top: 2px;
  margin-right: 3px;
}

.main-body {
  min-height: 480px;
}
</style>
