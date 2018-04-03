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
          <table class="table is-fullwidth">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Host</th>
                  <th>Port</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, i) in sources">
                  <th>{{i+1}}</th>
                  <td><input class="input" type="text" placeholder="Hostname or IP" v-model="s.host"></td>
                  <td><input class="input" type="number" placeholder="Port number" v-model.number="s.port"></td>
                  <td><input class="input" type="text" placeholder="Description" v-model="s.description"></td>
                  <td class="action-column"><a class="delete delete-button" @click="deleteRow(i)"></a></td>
                </tr>
              </tbody>
            </table>
            <div class="buttons-row">
              <a class="button" @click="addRow">Add Row</a>
            </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-link" @click="apply">Apply</a>
          <a class="button button-right" @click="close">Cancel</a>
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
      sources: []
    }
  },
  watch: {
    opened: function (val) {
      if(val){
        this.sources = this.$store.state.sources.slice()
      }
    },
  },
  methods: {
    close () {
      this.$emit('close-sources-modal')
    },
    apply () {
      var sources = []
      this.sources.forEach(function(s){
        if(s.host && s.port){
          sources.push(s)
        }
      })
      this.$store.commit('setSources', sources)
      this.$emit('close-sources-modal')
    },
    addRow () {
      this.sources.push({host: '', port: 8000, description: ''})
    },
    deleteRow (i) {
      this.sources.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>

.action-column {
  text-align: center;

  .delete-button {
    position: relative;
    top: 5px;
  }
}

.buttons-row {
  text-align: center;
}

.button-right {
  position: absolute;
  right: 0px;
  margin-right: 20px;
}

</style>
