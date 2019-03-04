<template>
  <md-card>
    <md-card-header>
      <md-button class="md-raised md-primary header-btn" @click="preview">Preview / Edit</md-button>
      <md-button class="md-raised md-primary header-btn" @click="createWordDoc">Download Word Doc</md-button>
    </md-card-header>
    <md-card-content>
      <p class="md-body-1">Showing {{previewDirectory.length }} of {{ directory.length}} members.</p>
      <div class="md-content person" v-for="{survey, person} in previewDirectory" :key="person.name">
        <div class="md-layout md-alignment-top-left  md-gutter">
          <!-- vitals -->
          <div class="md-layout-item md-size-50 vitals">
            <div class="md-layout">
              <div class="md-layout-item">
                <div class="md-display-1">{{survey.name || person.name }}</div>
              </div>
            </div>
            <div class="md-layout">
              <div class="md-layout-item">
                {{survey.gender}}
              </div>
            </div>
            <div class="md-layout" v-if="survey.birthday">
              <div class="md-layout-item">
                <span class="md-body-2">Birthday:</span> {{survey.birthday}} / <span class="md-body-2">Age:</span> {{ getAge(survey.birthday) }}
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item">
                <div class="md-title">Contact Info:</div>
                <div class="info-group">
                  <div>{{ survey.apartment }}</div>
                  <div>{{ survey.email }}</div>
                  <div>{{ (survey.phone || person.phone) | phone}}</div>
                </div>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item">
                <div class="md-title">Parent's Names:</div>
                <div class="info-group">
                  <div>{{ survey.parentsName }}</div>
                  <div>Address: {{ survey.homeAddress }}</div>
                  <div>Home Ward/Stake: {{ survey.homeStake }}</div>
                </div>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item">
                <div class="md-title">Prior Bishop:</div>
                <div class="info-group">
                  <div>Bishop: {{ survey.previousBishop }}</div>
                  <div>Ward/Stake: {{ survey.previousStake }}</div>
                </div>
              </div>
            </div>

          </div>

          <!-- photo -->
          <div class="md-layout-item md-size-50 portrait">
              <img v-if="survey.photo" :src="survey.photo.url + survey.photo.data"/>
              <img v-else src="static/img/meow.jpg"/>
          </div>

          <!-- QA -->
          <div class="md-layout-item md-size-100 qa">
            <div class="md-title">Other</div>
            <div class="info-group">
              <div class="md-body-2">School: {{ survey.student }}</div>
              <div class="md-body-2">Patriarchal Blessing: {{ survey.patriarchalBlessing }}</div>
              <div class="md-body-2">Prior Mission: {{survey.mission }}</div> 
              <div class="md-body-2">Mission Plans: {{ survey.misionPlans }} </div>
              <div class="md-body-2">Religion Class: {{ survey.religionClass }}</div>
              <div class="md-body-2">Engaged: {{ survey.engaged }}</div> 
              <div class="md-body-2">Employed: {{ survey.employed }}</div> 
              <div class="md-body-2">Prior Callings: {{ survey.previousCallings }}</div>
              <div class="md-body-2">Hobbies: {{ survey.interest }} </div>
              <div class="md-body-2">Liberty Square until: {{ survey.howLongToStay }}</div>
              <div class="md-body-2">Piano Skills: {{ survey.pianoSkills }} </div>
            </div>
          </div>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import { Document, Packer, Paragraph, Image, ImageParagraph, Media, BorderStyle, HorizontalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionRelativeFrom, VerticalPositionAlign } from 'docx'
import { saveAs } from 'file-saver';
export default {
  name: 'DataSheet',
  data () {
    return {
      directory: [],
      previewDirectory: []
    };
  },
  methods: {
    preview() {
      this.directory = this.$store.state.directory
      this.previewDirectory = this.directory.slice(0, 1);
    },
    getAge(birthDate) {
      return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
    },
    createWordDoc() {
      // load just in case
      if(this.directory.length == 0) {
        this.directory = this.$store.state.directory
      }


      const doc = new Document(undefined, {top:0.5, bottom:0.75});

      doc.Styles.createParagraphStyle("Heading1", "Heading 1")
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(36)
        .color("black")
        .spacing({ after: 10 });

      doc.Styles.createParagraphStyle("Heading2", "Heading 2")
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(34)
        .color("black")
        .spacing({ after: 10, before: 100 });

      doc.Styles.createParagraphStyle("info", "info")
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(14);

      this.directory.forEach(({survey, person}) => {
        doc.createParagraph(survey.name || person.name).heading1();

        if(person.photo) {
          const image = Media.addImage(doc, Buffer.from(person.photo.data, "base64"), 200, 300,{
            floating: {
              horizontalPosition: {
                offset: 4714400,
              },
              verticalPosition: {
                  offset: 814400,
              },
            }
          });
          doc.addImage(image);
        }

        if(survey.gender) {
          doc.createParagraph(survey.gender);
        }
        
        if(survey.birthday){
          const date = this.$moment(survey.birthday).format('MMMM D, YYYY')
          doc.createParagraph('Birthday: ' + date + '     Age: ' + this.getAge(survey.birthday));
        }

        // contact info
        doc.createParagraph('Contact Info:').heading2()
        doc.createParagraph(survey.apartment || person.apartment);
        doc.createParagraph((survey.email || ""));
        doc.createParagraph(this.$options.filters.phone(survey.phone || person.phone || ""));

        doc.createParagraph('Parent\'s Names:').heading2()
        doc.createParagraph((survey.parentsName || ""));
        doc.createParagraph('Address: ' + (survey.homeAddress || ""));
        doc.createParagraph('Home Ward/Stake: ' + (survey.homeStake || ""));

        doc.createParagraph('Prior Bishop:').heading2()
        doc.createParagraph('Bishop: ' + (survey.previousBishop || ""));
        doc.createParagraph('Ward/Stake: ' + (survey.previousStake || ""));

        doc.createParagraph('Other:').heading2()
        doc.createParagraph('School: ' + survey.student);
        doc.createParagraph('Patriarchal Blessing: ' + (survey.patriarchalBlessing || ""));
        doc.createParagraph('Prior Mission: ' + (survey.mission || ""));
        doc.createParagraph('Mission Plans: ' + (survey.misionPlans || ""));
        doc.createParagraph('Religion Class: ' + (survey.religionClass || ""));
        doc.createParagraph('Engaged: ' + (survey.engaged || ""));
        doc.createParagraph('Employed: ' + (survey.employed || ""));
        doc.createParagraph('Prior Callings: ' + (survey.previousCallings || ""));
        doc.createParagraph('Hobbies: ' + (survey.interest || ""));
        doc.createParagraph('Liberty Square until: ' + (survey.howLongToStay || ""));
        doc.createParagraph('Piano Skills: ' + (survey.pianoSkills || ""));
        doc.createParagraph('').pageBreak();
        
      })

      const packer = new Packer();
      packer.toBlob(doc).then((blob) => {
        // saveAs from FileSaver will download the file
        saveAs(blob, `DataSheet.docx`);
      });

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.person {
  page-break-inside: avoid;
  margin-bottom: 100px;
}
.portrait{
  text-align: center;
  
}
.portrait img {
  max-height: 375px;
  max-width: 300px;
}
.vitals {

}
.info-group {
  margin-left: 20px;
}

</style>
