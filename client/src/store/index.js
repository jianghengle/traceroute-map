import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import VueResource from 'vue-resource'
Vue.use(VueResource)

var sources = [
  {host: 'localhost', port: 8000, description: 'test'}
]

var localhost = {ip: '', latitude: null, longitude: null, country_name: '', region_name: '', city: ''}
Vue.http.get('https://api.ipify.org?format=json').then(resp => {
  localhost.ip = resp.body.ip
  Vue.http.get('http://freegeoip.net/json/' + localhost.ip).then(resp => {
    var geo = resp.body
    localhost.latitude = geo.latitude
    localhost.longitude = geo.longitude
    localhost.country_name = geo.country_name
    localhost.region_name = geo.region_name
    localhost.city = geo.city
  }, error => {
    console.log('error in get client ip')
  })
}, error => {
  console.log('error in get client ip')
})

var cachedGeo = {}

export default new Vuex.Store({
  state: {
    localhost: localhost,
    sources: sources,
    routes: {}
  },
  mutations: {

    addSource (state, source) {
      state.sources.push(source)
    },

    startRouting (state, obj) {
      var source = makePoint()
      source.host = obj.source.host
      getGeoInfo(source)
      var destination = makePoint()
      var hops = []
      var route = {id: obj.id, routing: true, source: source, hops: hops, destination: destination}
      if(state.routes[obj.id]){
        state.routes[obj.id] = route
      }else{
        Vue.set(state.routes, obj.id, route)
      }
    },

    stopRouting (state, id) {
      state.routes[id].routing = false
    },

    addHop (state, obj) {
      var id = obj.tracerouteId
      var route = state.routes[id]
      if(obj.hop == 'dest'){
        var dest = route.destination
        dest.ip = obj.ip
        dest.host = obj.host
        getGeoInfo (dest)
      }else{
        var point = makePoint()
        point.hop = obj.hop
        point.ip = obj.ip
        point.host = obj.host
        point.ttl = obj.ttl
        route.hops.push(point)
        if(point.ip){
          getGeoInfo (point)
        }
      }
    },

    clearRoute (state, id) {
      state.routes[id] = null
    }
  }
})

function makePoint () {
  return {
    hop: null,
    host: '',
    ip: '',
    ttl: null,
    lat: null,
    lng: null,
    country: '',
    region: '',
    city: ''
  }
}

function getGeoInfo (point) {
  var key = point.ip
  if(!key){
    key = point.host
  }
  if(cachedGeo[key]){
    var geo = cachedGeo[key]
    point.ip = geo.ip
    copyGeoInfo (point, geo)
  }else{
    Vue.http.get('http://freegeoip.net/json/' + key).then(resp => {
      var geo = resp.body
      point.ip = geo.ip
      if(geo.latitude && geo.longitude){
        copyGeoInfo(point, geo)
        cachedGeo[key] = geo
      }else{
        copyGeoInfo(point, localhost)
        cachedGeo[key] = localhost
      }
    }, error => {
      console.log('error in get ip and geo')
      copyGeoInfo(point, localhost)
      cachedGeo[key] = localhost
    })
  }
  
  function copyGeoInfo (point, geo) {
    point.lat = geo.latitude
    point.lng = geo.longitude
    point.country = geo.country_name
    point.region = geo.region_name
    point.city = geo.city
  }

}
