<template>
  <div class="traceroute-block">
    <div class="card" :style="cardStyle">
      <div class="card-buttons">
        <a v-if="showDetail" @click="showDetail = !showDetail">
          <icon class="icon-button" name="chevron-circle-up" scale="1.3" :style="colorStyle"></icon>
        </a>
        <a v-if="!showDetail" @click="showDetail = !showDetail">
          <icon class="icon-button" name="chevron-circle-down" scale="1.3" :style="colorStyle"></icon>
        </a>
        <a class="delete" :style="backgroundStyle" v-if="traceroutes.length > 1" @click="deleteTraceroute"></a>
      </div>
      <div class="card-content padding-bottom-less">
        <div class="content">

          <div :class="{'columns': !sidebar}">
            <div :class="{'column': !sidebar, 'column-sidebar': sidebar}">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Source</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="sourceId">
                          <option v-for="(opt, i) in sources" v-bind:value="i">{{opt.name}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div :class="{'column': !sidebar, 'column-sidebar': sidebar}">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Destination</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input" type="email" v-model="destination" placeholder="Domain name or IP">
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div :class="{'column': !sidebar, 'column-sidebar': sidebar}">
              <div class="field is-grouped is-grouped-centered">
                <p class="control">
                  <a class="button" :class="{'is-info': route && route.color}" :style="backgroundStyle" :disabled="!destination" v-show="!route || !route.routing" @click="startRouting">
                    Route
                  </a>
                </p>
                <p class="control">
                  <a class="button is-danger" :style="backgroundStyle" v-show="route && route.routing" @click="stopRouting">
                    <icon name="spinner" class="fa-spin"></icon>&nbsp;Stop
                  </a>
                </p>
                <p class="control" >
                  <a class="button" v-show="route && !route.routing" @click="clearRoute">
                    Clear
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div class="table-container" v-show="showDetail">
            <table class="table is-narrow" v-if="route">
              <thead>
                <tr>
                  <th>Hop</th>
                  <th>IP</th>
                  <th>Host</th>
                  <th>RTT (ms)</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>City</th>
                  <th>Region</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="route.source" @click="centerTo(route.source)" class="clickable">
                  <th>{{sidebar ? 'S' : 'Source'}}</th>
                  <td>{{route.source.ip}}</td>
                  <td>{{route.source.host}}</td>
                  <td></td>
                  <td>{{route.source.lat}}</td>
                  <td>{{route.source.lng}}</td>
                  <td>{{route.source.city}}</td>
                  <td>{{route.source.region}}</td>
                  <td>{{route.source.country}}</td>
                </tr>
                <tr v-for="h in route.hops" @click="centerTo(h)" class="clickable">
                  <th>{{h.hop}}</th>
                  <td>{{h.ip ? h.ip : '*' }}</td>
                  <td>{{h.host}}</td>
                  <td>{{h.rtt}}</td>
                  <td>{{h.lat}}</td>
                  <td>{{h.lng}}</td>
                  <td>{{h.city}}</td>
                  <td>{{h.region}}</td>
                  <td>{{h.country}}</td>
                </tr>
                <tr v-if="route && route.routing">
                  <th><icon name="spinner" class="fa-spin"></icon></th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr v-if="route.destination" @click="centerTo(route.destination)" class="clickable">
                  <th>{{sidebar ? 'D' : 'Destination'}}</th>
                  <td>{{route.destination.ip}}</td>
                  <td>{{route.destination.host}}</td>
                  <td></td>
                  <td>{{route.destination.lat}}</td>
                  <td>{{route.destination.lng}}</td>
                  <td>{{route.destination.city}}</td>
                  <td>{{route.destination.region}}</td>
                  <td>{{route.destination.country}}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'traceroute',
  props: ['tracerouteId', 'traceroutes'],
  data () {
    return {
      sourceId: 0,
      destination: '',
      ws: null,
      tr: null,
      showDetail: true
    }
  },
  computed: {
    sources () {
      return this.$store.state.sources.map(function(s, i){
        var opt = Object.assign({}, s)
        opt.name = s.host
        if(s.port){
          opt.name += ':' + s.port
        }
        if(s.description){
          opt.name += ' (' + s.description + ')'
        }
        return opt
      })
    },
    source () {
      return this.sources[this.sourceId]
    },
    route () {
      return this.$store.state.routes[this.tracerouteId]
    },
    latestPoint () {
      if(!this.route)
        return null
      if(!this.route.routing){
        var dest = this.route.destination
        if(dest.lat !== null && dest.lng !== null){
          return {lat: dest.lat, lng: dest.lng}
        }
        return null
      }
      if(this.route.hops.length){
        var hop = this.route.hops[this.route.hops.length - 1]
        if(hop.lat !== null && hop.lng !== null){
          return {lat: hop.lat, lng: hop.lng}
        }
        return null
      }
      var source = this.route.source
      if(source.lat !== null && source.lng !== null){
        return {lat: source.lat, lng: source.lng}
      }
      return null
    },
    sidebar () {
      return this.$store.state.sidebar
    },
    cardStyle () {
      var style = {}
      if(this.route && this.route.color){
        var color = this.route.color
        style = {
          '-webkit-box-shadow': '0 2px 3px ' + color + ', 0 0 0 1px ' + color,
          'box-shadow': '0 2px 3px ' + color + ', 0 0 0 1px ' + color
        }
      }
      return style
    },
    colorStyle () {
      var style = {}
      if(this.route && this.route.color){
        var color = this.route.color
        style = {color: color}
      }
      return style
    },
    backgroundStyle () {
      var style = {}
      if(this.route && this.route.color){
        var color = this.route.color
        style = {'background-color': color}
      }
      return style
    }
  },
  watch: {
    latestPoint: function (val) {
      if(val){
        this.$emit('center-to-point', val)
      }
    },
  },
  methods: {
    startRouting () {
      if(!this.destination)
        return
      var obj = {id: this.tracerouteId, source: this.source, destination: this.destination}
      this.$store.commit('startRouting', obj)

      var vm = this
      if(xTARGETx == 'electron' && this.source.host == 'localhost' && this.source.port == ''){
        var trs = window.require('electron').remote.require('./services/traceroute.service.js')
        this.tr = trs.makeTraceroute(this.destination, function(hop){
          hop.tracerouteId = vm.tracerouteId
          vm.$store.commit('addHop', hop)
        },function(){
          vm.$store.commit('stopRouting', vm.tracerouteId)
        })
        this.tr.start()
      }else{
        var url = 'ws://' + this.source.host
        if(this.source.port){
          url += ':' + this.source.port
        }
        url += '/?target=' + this.destination
        this.ws = new WebSocket(url)
        this.ws.onopen = function () {}
        this.ws.onmessage = function (evt) {
          var msg = evt.data
          var obj = JSON.parse(msg)
          obj.tracerouteId = vm.tracerouteId
          vm.$store.commit('addHop', obj)
        }
        this.ws.onclose = function () {
          vm.$store.commit('stopRouting', vm.tracerouteId)
        }
      }
    },
    stopRouting () {
      if(this.ws){
        this.ws.close()
      }
      if(this.tr){
        this.tr.stop()
        this.tr = null
      }
      this.$store.commit('stopRouting', this.tracerouteId)
    },
    clearRoute () {
      this.$store.commit('clearRoute', this.tracerouteId)
    },
    centerTo (point) {
      if(point && (point.lat !== null) && (point.lng !== null)){
        var obj = {routeId: this.tracerouteId, pointId: point.id}
        this.$store.commit('putFront', obj)
        this.$emit('center-to-point', point)
      }
    },
    deleteTraceroute () {
      if(this.ws){
        this.ws.close()
      }
      if(this.tr){
        this.tr.stop()
        this.tr = null
      }
      this.$store.commit('clearRoute', this.tracerouteId)
      this.$emit('delete-traceroute', this.tracerouteId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.traceroute-block {
  margin: 10px;
}

.card-buttons {
  float: right;
  margin-top: 10px;
  margin-right: 10px;

  .icon-button {
    color: #cecece;
  }

  .icon-button:hover {
    color: #9e9e9e;
  }
}

.padding-bottom-less {
  padding-bottom: 3px;
}

.column-sidebar {
  margin-bottom: 10px;
}

.table-container {
  overflow: auto;
}

.clickable {
  cursor: pointer;
}
</style>
