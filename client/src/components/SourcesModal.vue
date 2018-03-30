<template>
    <div class="modal"
        :class="{'is-active': opened}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Configure Traceroute Sources</p>
          <button class="delete" @click="close"></button>
        </header>
        <section class="modal-card-body modal-body">
          <div v-if="error" class="notification is-danger">
            <button class="delete" @click="error=''"></button>
            {{error}}
          </div>
          Sources
        </section>
        <footer class="modal-card-foot">
          <a class="button" @click="close">Cancel</a> 
        </footer>
      </div>
    </div>
</template>

<script>
export default {
  name: 'sources-modal',
  props: ['opened'],
  data () {
    return {
      error: '',
    }
  },
  methods: {
    close(){
      this.$emit('close-sources-modal', false)
    }
  }
}
</script>

<style lang="scss" scoped>


</style>