<template>
  <div class="main-body">
    <div>
      <gmap-map
        :center="mapCenter"
        :zoom="5"
        :options="{scrollwheel: false}"
        style="width: 100%; height: 600px">
      </gmap-map>
    </div>
    <div v-for="t in traceroutes">
      <traceroute></traceroute>
    </div>
  </div>
</template>

<script>
import Traceroute from './Traceroute'

export default {
  name: 'my-body',
  components: {
    Traceroute
  },
  data () {
    return {
      mapCenter: {lat: 40.8186, lng: -96.7100},
      traceroutes: [1]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-body {
  min-height: 800px;
}
</style>
