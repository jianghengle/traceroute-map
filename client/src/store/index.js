import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import VueResource from 'vue-resource'
Vue.use(VueResource)

var sources = []
var localSource = {host: 'localhost', port: '', description: 'this computer'}
var ss = localStorage.getItem('sources')
if(ss){
  try {
    sources = JSON.parse(ss)
  }
  catch(error) {
    sources = []
  }
}

if(!sources || !Array.isArray(sources) || !sources.length) {
  sources = [{host: '129.93.175.20', port: 8000, description: 'test'}]
}

if(xTARGETx == 'electron'){
  if(sources[0].host != localSource.host || sources[0].port != localSource.port){
    sources.unshift(localSource)
  }
}

var localhost = {ip: '', latitude: null, longitude: null, country_name: '', region_name: '', city: ''}
Vue.http.get('https://api.ipify.org?format=json').then(resp => {
  localhost.ip = resp.body.ip
  Vue.http.get('http://freegeoip.net/json/' + localhost.ip).then(resp => {
    var geo = resp.body
    localhost.lat = geo.latitude
    localhost.lng = geo.longitude
    localhost.country = geo.country_name
    localhost.region = geo.region_name
    localhost.city = geo.city
  }, error => {
    console.log('error in get client ip')
  })
}, error => {
  console.log('error in get client ip')
})

var cachedGeo = {}
var colors = ['#001f3f', '#85144b', '#0074D9', '#FF4136','#3D9970', '#642cb1', '#39CCCC', '#FF851B']

export default new Vuex.Store({
  state: {
    sources: sources,
    routes: {1: {id: 1, color: colors[0]}},
    sidebar: false,
    colors: colors
  },
  mutations: {

    setSources (state, sources) {
      if(xTARGETx == 'electron'){
        sources.unshift(localSource)
      }
      state.sources = sources
      localStorage.setItem('sources', JSON.stringify(sources))
    },

    addRoute (state) {
      var maxId = 0
      Object.values(state.routes).forEach(function (r) {
        if(r && r.id > maxId) {
          maxId = r.id
        }
      })
      var id = maxId + 1
      var route = {id: id, color: getRouteColor(id)}
      Vue.set(state.routes, id, route)
    },

    deleteRoute (state, id) {
      state.routes[id] = null
    },

    startRouting (state, obj) {
      var source = makePoint()
      source.hop = 'S'
      source.id = obj.id * 100
      source.zIndex = source.id
      source.host = obj.source.host
      getGeoInfo(source, localhost)
      var destination = makePoint()
      destination.hop = 'D'
      destination.id = (obj.id + 1) * 100 - 1
      destination.zIndex = destination.id
      var hops = []
      var route = {id: obj.id, zIndex: obj.id, routing: true, source: source, hops: hops, destination: destination}
      route.color = getRouteColor(route.id)
      if(state.routes[obj.id]){
        route.color = state.routes[obj.id].color
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
        getGeoInfo (dest, route.source)
      }else{
        var point = makePoint()
        point.hop = obj.hop
        point.ip = obj.ip
        point.host = obj.host
        point.rtt = obj.rtt
        point.id = route.source.id + point.hop
        point.zIndex = point.id
        route.hops.push(point)
        route.hops.sort(function(a, b) {
          return a.hop - b.hop
        })
        if(point.ip){
          getGeoInfo (point, route.source)
        }
      }
    },

    clearRoute (state, id) {
      var route = state.routes[id]
      state.routes[id] = {id: route.id, color: route.color}
    },

    putFront (state, obj) {
      var routeId = obj.routeId
      putRouteFront(state.routes, routeId)
      var route = state.routes[routeId]

      var pointId = obj.pointId
      putPointFront(route, pointId)
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

    toggleSidebar (state) {
      state.sidebar = !state.sidebar
    },

    setRouteColor (state, obj) {
      state.routes[obj.id].color = obj.color
    }
  }
})


function putRouteFront (routes, routeId) {
  var route, maxRoute
  var keys = Object.keys(routes)
  for(var i=0;i<keys.length;i++){
    var r = routes[keys[i]]
    if(!r)
      continue
    if(r.id == routeId)
      route = r
    if(!maxRoute || r.zIndex > maxRoute.zIndex)
      maxRoute = r
  }

  if(route == maxRoute)
    return

  var temp = route.zIndex
  changeRouteZIndex(route, maxRoute.zIndex)
  changeRouteZIndex(maxRoute, temp)
}

function changeRouteZIndex (route, zIndex) {
  if(route.zIndex == zIndex)
    return
  route.zIndex = zIndex
  route.source.zIndex = (route.source.zIndex % 100) + (zIndex * 100)
  for(var i=0;i<route.hops.length;i++){
    var hop = route.hops[i]
    hop.zIndex = (hop.zIndex % 100) + (zIndex * 100)
  }
  route.destination.zIndex = (route.destination.zIndex % 100) + (zIndex * 100)
}

function putPointFront (route, pointId) {
  var point, maxPoint

  if(route.source.id === pointId)
    point = route.source
  if(!maxPoint || route.source.zIndex > maxPoint.zIndex)
    maxPoint = route.source

  for(var i=0;i<route.hops.length;i++){
    var hop = route.hops[i]
    if(hop.id === pointId)
      point = hop
    if(!maxPoint || hop.zIndex > maxPoint.zIndex)
      maxPoint = hop
  }

  if(route.destination.id === pointId)
    point = route.destination
  if(!maxPoint || route.destination.zIndex > maxPoint.zIndex)
    maxPoint = route.destination

  if(point == maxPoint)
    return

  var temp = point.zIndex
  point.zIndex = maxPoint.zIndex
  maxPoint.zIndex = temp
  maxPoint.infoOpened = false
  point.infoOpened = true
}

function getRouteColor (id) {
  return colors[(id - 1) % colors.length]
}

function findPointById (routes, id) {
  var keys = Object.keys(routes)
  for(var i=0;i<keys.length;i++){
    var route = routes[keys[i]]
    if(!route || !route.source)
      continue
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
    rtt: null,
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

function getGeoInfo (point, defaultInfo) {
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
      var lat = geo.latitude
      var lng = geo.longitude
      if(isNaN(lat) || isNaN(lng) || (lat===0 && lng===0)){
        copyGeoInfo(point, defaultInfo)
      }else{
        point.lat = lat
        point.lng = lng
        point.country = geo.country_name
        point.region = geo.region_name
        point.city = geo.city
        cachedGeo[key] = point
      }
    }, error => {
      console.log('error in get ip and geo')
      copyGeoInfo(point, defaultInfo)
    })
  }
  
  function copyGeoInfo (point, geo) {
    point.lat = geo.lat
    point.lng = geo.lng
    point.country = geo.country
    point.region = geo.region
    point.city = geo.city
  }
}
