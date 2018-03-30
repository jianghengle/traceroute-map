<template>
  <div id="app">
    <my-header/>
    <my-body/>
    <my-footer/>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader'
import MyBody from './components/MyBody'
import MyFooter from './components/MyFooter'

export default {
  name: 'App',
  components: {
    MyHeader,
    MyBody,
    MyFooter
  }
}
</script>

<style lang="scss">
@import "~bulma";

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
