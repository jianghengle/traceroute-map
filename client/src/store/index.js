import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import VueResource from 'vue-resource'
Vue.use(VueResource)

var sources = []
var ss = localStorage.getItem('sources')
if(ss){
  sources = JSON.parse(ss)
}else{
  sources = [{host: '129.93.175.20', port: 8000, description: 'test'}]
}

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

    setSources (state, sources) {
      state.sources = sources
      localStorage.setItem('sources', JSON.stringify(sources))
    },

    startRouting (state, obj) {
      var source = makePoint()
      source.hop = 'S'
      source.id = obj.id * 100
      source.zIndex = source.id
      source.host = obj.source.host
      getGeoInfo(source)
      var destination = makePoint()
      destination.hop = 'D'
      destination.id = (obj.id + 1) * 100 - 1
      destination.zIndex = destination.id
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
        point.id = route.source.id + point.hop
        point.zIndex = point.id
        route.hops.push(point)
        if(point.ip){
          getGeoInfo (point)
        }
      }
    },

    clearRoute (state, id) {
      state.routes[id] = null
    },

    putFront (state, obj) {
      var id = obj.tracerouteId
      var route = state.routes[id]
      var zIndex = obj.point.zIndex
      var p, f
      var max = 0
      if(route.source.zIndex === zIndex)
        p = route.source
      if(route.source.zIndex > max){
        f = route.source
        max = route.source.zIndex
      }
      for(var i=0;i<route.hops.length;i++){
        var h = route.hops[i]
        if(h.zIndex === zIndex)
          p = h
        if(h.zIndex > max){
          f = h
          max = h.zIndex
        }
      }
      if(route.destination.zIndex === zIndex)
        p = route.destination
      if(route.destination.zIndex > max){
        f = route.destination
        max = route.destination.zIndex
      }
      var temp = p.zIndex
      p.zIndex = f.zIndex
      f.zIndex = temp
    },

    openInfo (state, id) {
      var p = findPointById (state.routes, id)
      if(p)
        p.infoOpened = true
    },

    closeInfo (state, id) {
      var p = findPointById (state.routes, id)
      if(p)
        p.infoOpened = false
    },
  }
})


function findPointById (routes, id) {
  var keys = Object.keys(routes)
  for(var i=0;i<keys.length;i++){
    var route = routes[keys[i]]
    if(route.source.id === id){
      return route.source
    }
    for(var j=0;j<route.hops.length;j++){
      var h = route.hops[j]
      if(h.id === id){
        return h
      }
    }
    if(route.destination.id === id){
      return route.destination
    }
  }
  return null
}

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
    city: '',
    zIndex: 0,
    id: null,
    infoOpened: false
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
