<template>
  <div>
    <div class="md-title">Export CSV from Google Forms</div>
    <div class="md-body">A survey can augment information that you want on your ward directory, and correct information outdated information that is listed in LDS tools.</div>
    <img src="static/img/google_forms_export.png">
    <md-field>
      <label>Response CSV Zip</label>
      <md-file v-model="single" @md-change="readCSV" />
    </md-field>

    <div class="md-body-1">Found {{ people.length }} responses. Removed {{ uploaded.length - people.length }} duplicates by using their most recent submission.</div>
    <md-table v-if="people.length" :value="people" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
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
  name: 'CSVImport',
  data () {
    return {
      single: null,
      uploaded: [],
    };
  },
  computed: {
    people: function() {
      return this.$store.state.people || [];
    },
  },
  methods: {
    async readCSV(fileList) {
      const reader = new JSZip();
      const zip = await reader.loadAsync(fileList[0])
      const csv = Object.keys(zip.files).find(f => f.includes(".csv"));
      console.log(zip);
      const data = await zip.file(csv).async("string");
      Papa.parse(data, {
        complete: (results) => {
          this.uploaded = results.data.slice(1);
          this.$store.commit('people', this.uploaded.filter(row=>row.length > 1))
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
