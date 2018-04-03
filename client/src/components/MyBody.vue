<template>
  <div class="main-body">
    <div>
      <gmap-map
        ref="myMap"
        :center="mapCenter"
        :zoom="5"
        :options="{scrollwheel: false}"
        style="width: 100%; height: 600px">
        <gmap-marker
          v-for="(m, index) in markers"
          :key="'m-' + m.id"
          :label=m.label
          :position="m.position"
          :z-index="m.zIndex"
          :clickable="true"
          @click="openInfo(m.id)">
        </gmap-marker>
        <gmap-info-window
          v-for="(m, index) in markers"
          :key="'i-' + m.id"
          :opened="m.infoOpened"
          :position="m.position"
          :z-index="m.zIndex"
          :options="infoOptions"
          :content="m.info"
          @closeclick="closeInfo(m.id)">
          <span v-html="m.info"></span>
        </gmap-info-window>
        <gmap-polyline
          v-for="(p, index) in polylines"
          :key="'p-' + p.id"
          :path="p.path"
          :options="p.options">
        </gmap-polyline>
      </gmap-map>
    </div>
    <div v-for="t in traceroutes">
      <traceroute
        :traceroute-id="t.id"
        @center-to-point="centerToPoint">
      </traceroute>
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
      traceroutes: [{id: 1}],
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infos: []
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
            polylines.push({
              id: route.id,
              path: path,
              options: {zIndex: route.id}
            })
            var lastPath = []
            if(path.length){
              lastPath.push(path[path.length-1])
            }
            this.addToPath(lastPath, route.destination)
            var len = polylines.length
            polylines.push({
              id: 'last-' + len,
              path: lastPath,
              options: {
                zIndex: route.id,
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
              id: route.id,
              path: path,
              options: {zIndex: route.id}
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
          position: {lat: point.lat, lng: point.lng},
          id: point.id,
          zIndex: point.zIndex,
          infoOpened: point.infoOpened
        }
        var info = '<table><tr><td><strong>Hop:</strong></td>'
        if(marker.label == 'S'){
          info += '<td>Source</td>'
        }else if(marker.label == 'D'){
          info += '<td>Destination</td>'
        }else {
          info += '<td>' + marker.label + '</td></tr>'
        }
        info += '<tr><td><strong>IP:</strong></td><td>' + point.ip + '</td></tr>'
        info += '<tr><td><strong>Host:</strong></td><td>' + point.host + '</td></tr>'
        if(point.ttl)
          info += '<tr><td><strong>TTL:</strong></td><td>' + point.ttl + ' ms</td></tr>'
        var location = point.city
        location = location ? location + ', ' + point.region : location + point.region
        location = location ? location + ', ' + point.country : location + point.country
        info += '<tr><td><strong>Location:</strong></td><td>' + location + '</td></tr></table>'
        marker.info = info
        markers.push(marker)
      }
    },
    addToPath (path, point) {
      if(point.lat && point.lng){
        path.push({lat: point.lat, lng: point.lng})
      }
    },
    centerToPoint (point) {
      this.$refs.myMap.panTo(point)
    },
    openInfo (id) {
      this.$store.commit('openInfo', id)
    },
    closeInfo (id) {
      this.$store.commit('closeInfo', id)
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
