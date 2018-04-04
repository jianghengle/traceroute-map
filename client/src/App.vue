<template>
  <div id="app">
    <my-header/>
    <my-body/>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader'
import MyBody from './components/MyBody'

export default {
  name: 'App',
  components: {
    MyHeader,
    MyBody
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
