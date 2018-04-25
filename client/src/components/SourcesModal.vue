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
                  <th class="source-number-cell">{{i+1}}</th>
                  <td><input class="input host-input" type="text" placeholder="Hostname or IP" v-model="s.host" :class="{'is-static': inElectron && i==0}"></td>
                  <td><input class="input port-number-input" type="number" placeholder="Port number" v-model.number="s.port" v-if="!inElectron || i!=0"></td>
                  <td><input class="input" type="text" placeholder="Description" v-model="s.description" :class="{'is-static': inElectron && i==0}"></td>
                  <td class="action-column"><a class="delete delete-button" @click="deleteRow(i)" v-if="!inElectron || i!=0"></a></td>
                </tr>
              </tbody>
            </table>
            <div class="buttons-row">
              <a class="button" @click="addRow">Add Source</a>
            </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-link" @click="apply">Save</a>
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
      sources: [],
      inElectron: xTARGETx == 'electron'
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
    top: 8px;
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

.source-number-cell {
  padding-top: 15px;
}

.host-input {
  min-width: 300px;
}

.port-number-input {
  width: 85px;
}


</style>
