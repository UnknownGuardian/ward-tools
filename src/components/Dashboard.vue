<template>
  <div>
    <md-card class="noprint">
      <md-steppers md-dynamic-height>
        <md-step id="first" md-label="Church Directory Import">
          <ChurchCSVImport></ChurchCSVImport>
        </md-step>
        <md-step id="second" md-label="Survey Response Import">
          <SurveyCSVImport></SurveyCSVImport>
        </md-step>
        <md-step id="third" md-label="Photo Upload">
          <ImagesImport></ImagesImport>
        </md-step>
        <md-step id="preview" md-label="Download">
          <h1>Directory</h1>
          <p class="md-body-1">Create a directory of Names, Phone Numbers, and pictures of members of your ward, grouped by last name or apartment.</p>
          <Directory></Directory>
          <h1>Data Sheets:</h1>
          <p class="md-body-1">Create a data sheet of each member in your ward, with key information from your survey.</p>
          <DataSheet></DataSheet>
        </md-step>
      </md-steppers>
    </md-card>
  </div>
</template>

<script>

import SurveyCSVImport from './SurveyCSVImport'
import ChurchCSVImport from './ChurchCSVImport'
import ImagesImport from './ImagesImport'
import Directory from './Directory'
import DataSheet from './DataSheet'


export default {
  name: 'Dashboard',
  components: {
    SurveyCSVImport,
    ChurchCSVImport,
    ImagesImport,
    Directory,
    DataSheet
  },
  data () {
    return {
    };
  },
  computed: {
    
  },
  async mounted() {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-card {
  margin-top: 30px;
}
</style>
