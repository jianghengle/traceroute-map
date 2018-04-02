<template>
  <div class="traceroute-block">
    <div class="card">
      <div class="card-content">
        <div class="content">

          <div class="columns">
            <div class="column">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Source</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <div class="select is-fullwidth" v-model="sourceId">
                        <select>
                          <option v-for="(opt, i) in sources" v-bind:value="i">{{opt.name}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
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
            <div class="column">
              <div class="field is-grouped is-grouped-centered">
                <p class="control">
                  <a class="button is-info" :disabled="!destination" v-show="!route || !route.routing" @click="startRouting">
                    Route
                  </a>
                </p>
                <p class="control">
                  <a class="button is-danger" v-show="route && route.routing" @click="stopRouting">
                    <icon name="spinner" class="fa-spin"></icon>&nbsp;Stop
                  </a>
                </p>
                <p class="control" >
                  <a class="button is-light" v-show="route && !route.routing" @click="clearRoute">
                    Clear
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <table class="table is-narrow" v-if="route">
              <thead>
                <tr>
                  <th>Hop</th>
                  <th>IP</th>
                  <th>Host</th>
                  <th>TTL</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>City</th>
                  <th>Region</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="route.source">
                  <th>Source</th>
                  <td>{{route.source.ip}}</td>
                  <td>{{route.source.host}}</td>
                  <td></td>
                  <td>{{route.source.lat}}</td>
                  <td>{{route.source.lng}}</td>
                  <td>{{route.source.city}}</td>
                  <td>{{route.source.region}}</td>
                  <td>{{route.source.country}}</td>
                </tr>
                <tr v-for="h in route.hops">
                  <th>{{h.hop}}</th>
                  <td>{{h.ip ? h.ip : '*' }}</td>
                  <td>{{h.host}}</td>
                  <td>{{h.ttl}}</td>
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
                <tr v-if="route.destination">
                  <th>Desitination</th>
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
  props: ['tracerouteId'],
  data () {
    return {
      sourceId: 0,
      destination: '',
      ws: null
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
    }
  },
  methods: {
    startRouting () {
      if(!this.destination)
        return
      var obj = {id: this.tracerouteId, source: this.source, destination: this.destination}
      this.$store.commit('startRouting', obj)
      var url = 'ws://' + this.source.host
      if(this.source.port){
        url += ':' + this.source.port
      }
      url += '/?target=' + this.destination
      this.ws = new WebSocket(url)
      var vm = this
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
    },
    stopRouting () {
      this.ws.close()
      this.$store.commit('stopRouting', this.tracerouteId)
    },
    clearRoute () {
      this.$store.commit('clearRoute', this.tracerouteId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.traceroute-block {
  margin: 15px;
}
</style>
