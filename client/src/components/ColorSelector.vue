<template>
  <div class="dropdown" v-on-clickaway="away">
    <div v-on:click="open" class="color-button"
        v-bind:style="{ background: color }">
    </div>
    <div class="dropdown-content" v-show="opened">
      <button v-for="c in colors" class="color-option"
          v-bind:class="{ 'current-color': c==color }"
          v-bind:style="{ background: c }"
          v-on:click="selectColor(c)">
      </button>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'color-selector',
  mixins: [ clickaway ],
  props: ['tracerouteId', 'color'],
  data (){
    return {
      opened: false
    }
  },
  computed: {
    colors () {
      return this.$store.state.colors
    }
  },
  methods: {
    open (){
      this.opened = !this.opened
    },
    away () {
      this.opened = false
    },
    selectColor (c) {
      this.opened = false
      this.$store.commit('setRouteColor', {id: this.tracerouteId, color: c})
    }
  },
}

</script>

<style lang="scss" scoped>

.dropdown {
  position: relative;
  top: 1px;
  margin: auto;

  .color-button {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  .dropdown-content {
    position: absolute;
    top: 20px;
    left: -3px;
    width: 46px;
    padding: 1px;
    z-index: 10;
    background: lightgray;

    .color-option {
      width: 20px;
      height: 20px;
      margin: 1px;
      cursor: pointer;
      border-radius: 4px;
    }

    .current-color {
      border: 2px solid white;
    }
  }
}

</style>
