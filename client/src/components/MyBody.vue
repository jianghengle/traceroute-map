<template>
  <div :class="{'main-body-sidebar': sidebar}">
    <div :class="{'map-container': !sidebar, 'map-container-sidebar': sidebar}">
      <gmap-map
        ref="myMap"
        :center="mapCenter"
        :zoom="5"
        style="width: 100%; height: 100%">
        <gmap-marker
          v-for="(m, index) in markers"
          :key="'m-' + m.id"
          :label=m.label
          :position="m.position"
          :z-index="m.zIndex"
          :clickable="true"
          :icon="m.icon"
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
    <div :class="{'routes-container-sidebar': sidebar}">
      <div>
        <div v-for="t in traceroutes" :key="t.id">
          <traceroute
            :traceroute-id="t.id"
            :traceroutes="traceroutes"
            @center-to-point="centerToPoint">
          </traceroute>
        </div>
        <div class="button-line">
          <a class="button" @click="addTraceoute">Add Traceoute</a>
        </div>
      </div>
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
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -38
        }
      },
      infos: []
    }
  },
  computed: {
    traceroutes () {
      var routes = this.$store.state.routes
      var traceroutes = Object.values(routes).filter(function(r){
        return r
      })
      traceroutes.sort(function(a, b){
        return a.id - b.id
      })
      return traceroutes
    },
    markers () {
      var routes = this.$store.state.routes
      var keys = Object.keys(routes)
      var markers = []
      for(var i=0;i<keys.length;i++){
        var route = routes[keys[i]]
        if(route && route.source){
          this.makeMarker(markers, route.source, route)
          for(var j=0;j<route.hops.length;j++){
            this.makeMarker(markers, route.hops[j], route)
          }
          this.makeMarker(markers, route.destination, route)
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
        if(route && route.source){
          var path = []
          this.addToPath(path, route.source)
          for(var j=0;j<route.hops.length;j++){
            this.addToPath(path, route.hops[j])
          }
          if(route.routing){
            polylines.push({
              id: route.id,
              path: path,
              options: {zIndex: route.zIndex, strokeColor: route.color}
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
                zIndex: route.zIndex,
                strokeOpacity: 0,
                icons: [{
                  icon: lineSymbol,
                  offset: '0',
                  repeat: '20px'
                }],
                strokeColor: route.color
              }
            })
          }else{
            this.addToPath(path, route.destination)
            polylines.push({
              id: route.id,
              path: path,
              options: {zIndex: route.zIndex, strokeColor: route.color}
            })
          }
        }
      }
      return polylines
    },
    sidebar () {
      return this.$store.state.sidebar
    }
  },
  methods: {
    makeMarker (markers, point, route) {
      if(point.lat !== null && point.lng !== null){
        var marker = {
          label: {
            text: point.hop.toString(),
            color: 'white',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold'
          },
          position: {lat: point.lat, lng: point.lng},
          id: point.id,
          zIndex: point.zIndex,
          infoOpened: point.infoOpened
        }
        var info = '<table><tr><td><strong>Hop:</strong></td>'
        if(marker.label.text == 'S'){
          info += '<td>Source</td>'
        }else if(marker.label.text == 'D'){
          info += '<td>Destination</td>'
        }else {
          info += '<td>' + marker.label.text + '</td></tr>'
        }
        info += '<tr><td><strong>IP:</strong></td><td>' + point.ip + '</td></tr>'
        info += '<tr><td><strong>Host:</strong></td><td>' + point.host + '</td></tr>'
        if(point.rtt)
          info += '<tr><td><strong>RTT:</strong></td><td>' + point.rtt + ' ms</td></tr>'
        var location = point.city
        location = location ? location + ', ' + point.region : location + point.region
        location = location ? location + ', ' + point.country : location + point.country
        info += '<tr><td><strong>Location:</strong></td><td>' + location + '</td></tr></table>'
        marker.info = info
        marker.icon = {
          path: 'M255 803 c-16 -105 -40 -160 -145 -328 -38 -60 -74 -131 -80 -157 -22 -88 23 -200 102 -251 150 -97 336 -21 378 154 18 72 1 124 -80 254 -105 168 -129 223 -145 328 -3 20 -10 37 -15 37 -5 0 -12 -17 -15 -37z',
          fillColor: route.color,
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 1,
          scale: 0.052,
          anchor: {x: 280, y: 845},
          labelOrigin: {x: 280, y: 300}
        },
        markers.push(marker)
      }
    },
    addToPath (path, point) {
      if(point.lat !== null && point.lng !== null){
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
    },
    addTraceoute () {
      this.$store.commit('addRoute')
    },
    deleteTraceroute (id) {
      /*
      var index = null
      for(var i=0;i<this.traceroutes.length;i++){
        if(this.traceroutes[i].id == id){
          index = i
          break
        }
      }
      if(index !== null){
        this.traceroutes.splice(index, 1)
      }*/
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.main-body-sidebar {
  position: fixed;
  top: 52px;
  width: 100%;
  height: calc(100% - 52px);
}

.map-container {
  width: 100%;
  height: 600px;
}

.map-container-sidebar {
  height: 100%;
  width: 65%;
  float: left;
}

.routes-container-sidebar {
  height: 100%;
  width: 35%;
  float: right;
  overflow: auto;
}

.button-line {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 15px;
}

</style>
