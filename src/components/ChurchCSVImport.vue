<template>
  <div>
    <div class="md-title">Export CSV from your ward</div>
    <div class="md-body">Start with basic information about your ward.</div>
    <md-field>
      <label>Ward CSV</label>
      <md-file v-model="single" @md-change="readCSV" />
    </md-field>

    <div class="md-body-1">Found {{ ward.length }} members.</div>
    <md-table v-if="ward.length" :value="ward" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Phone" md-sort-by="phone">{{ item.phone | phone }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import * as JSZip from 'jszip'
import * as Papa from 'papaparse'

export default {
  name: 'ChurchCSVImport',
  data () {
    return {
      single: null
    };
  },
  computed: {
    ward: function() {
      return this.$store.state.ward;
    },
  },
  methods: {
    async readCSV(fileList) {
      Papa.parse(fileList[0], {
        complete: (results) => {
          this.$store.commit('ward', results.data)
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-card {
  margin-top: 30px;
}
</style>
