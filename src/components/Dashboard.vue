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
          <Directory></Directory>
        </md-step>
      </md-steppers>
    </md-card>

    <!--<DataSheet></DataSheet>-->
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
