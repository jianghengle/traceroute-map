<template>
  <div class="main-body">
    <div>
      <gmap-map
        :center="mapCenter"
        :zoom="5"
        :options="{scrollwheel: false}"
        style="width: 100%; height: 600px">
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :label=m.label
          :position="m.position"
          :z-index="index">
        </gmap-marker>
        <gmap-polyline
          v-for="(p, index) in polylines"
          :path="p.path"
          :options="p.options">
        </gmap-polyline>
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
      traceroutes: [{id: 1}]
    }
  },
  computed: {
    markers () {
      var routes = this.$store.state.routes
      var keys = Object.keys(routes)
      var markers = []
      for(var i=0;i<keys.length;i++){
        var route = routes[keys[i]]
        if(route){
          this.makeMarker(markers, route.source)
          for(var j=0;j<route.hops.length;j++){
            this.makeMarker(markers, route.hops[j])
          }
          this.makeMarker(markers, route.destination)
        }
      }
      return markers
    },
    polylines () {
      var routes = this.$store.state.routes
      var keys = Object.keys(routes)
      var polylines = []
      var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4
      }
      for(var i=0;i<keys.length;i++){
        var route = routes[keys[i]]
        if(route){
          var path = []
          this.addToPath(path, route.source)
          for(var j=0;j<route.hops.length;j++){
            this.addToPath(path, route.hops[j])
          }
          if(route.routing){
            this.addToPath(path, route.destination)
            polylines.push({
              path: path,
              options: {}
            })
            var lastPath = []
            if(path.length){
              lastPath.push(path[path.length-1])
            }
            this.addToPath(lastPath, route.destination)
            polylines.push({
              path: lastPath,
              options: {
                strokeOpacity: 0,
                icons: [{
                  icon: lineSymbol,
                  offset: '0',
                  repeat: '20px'
                }]
              }
            })
          }else{
            this.addToPath(path, route.destination)
            polylines.push({
              path: path,
              options: {}
            })
          }
        }
      }
      return polylines
    }
  },
   methods: {
    makeMarker (markers, point) {
      if(point.lat && point.lng){
        var marker = {
          label: point.hop.toString(),
          position: {lat: point.lat, lng: point.lng}
        }
        markers.push(marker)
      }
    },
    addToPath (path, point) {
      if(point.lat && point.lng){
        path.push({lat: point.lat, lng: point.lng})
      }
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
