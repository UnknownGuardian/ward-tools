<template>
  <md-card>
    <md-card-header>
      <md-button class="md-raised md-primary header-btn" @click="preview">Preview / Edit</md-button> <md-button class="md-raised md-primary header-btn" @click="createWordDoc">Download Word Doc</md-button>
    </md-card-header>
    <md-card-content>
      <div class="md-body-1"><p>Editing with allow you to only remove people.</p><p>Moving members around, adding a cover page, or creating specific formatting can be done in Microsoft Word after downloading the Word document.</p></div>
      <md-content>
        <label>Group By: </label>
        <md-radio v-model="groupField" value="apartment" @change="groupBy(groupField)">Apartment</md-radio>
        <md-radio v-model="groupField" :value="null" @change="groupBy(groupField)">Last Name</md-radio>
      </md-content>

      <div class="md-layout md-alignment-top-center md-gutter apartment" v-for="a in groups" :key="a.name">
        <div class="md-layout-item md-size-100 md-display-1 apartment-name">{{a.name}}</div>
        <div class="md-layout-item md-size-15 member" v-for="m in a.members" :key="m.name">
          <div class="portrait">
            <img v-if="m.person.photo" :src="m.person.photo.url + m.person.photo.data"/>
            <img v-else src="static/img/meow.jpg"/>
          </div>
          <div class="details">
            <div class="md-body-1 person-name">{{m.person.name}}</div>
            <div class="md-body-1">{{ getPhone(m) | phone}}</div>
          </div>
          <div class="actions">
            <div class="md-body-1"><md-button  @click="removePerson(a, m)" class="md-primary md-raised">Remove</md-button></div>
          </div>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>

import { Document, Packer, Paragraph, Image, ImageParagraph, Media, BorderStyle } from 'docx'
import { saveAs } from 'file-saver';

export default {
  name: 'Directory',
  data () {
    return {
      groupField: 'apartment',
      groups: [], 
    };
  },
  computed: {
    directory: function() {
      return this.$store.state.directory;
    },
  },
  methods: {
    preview() {
      this.groupBy(this.groupField);
    },

    removePerson(group, member) {
      group.members.splice(group.members.indexOf(member), 1);
    },

    addToSimilarApartment(acc, curr, apartment) {
      const standardizedApartment = apartment.toLowerCase();

      let name = "Jefferson";
      if (/move/g.test(standardizedApartment)) {
        return;
      } else if (/(j.*)/g.test(standardizedApartment)) {
        name = "Jefferson";
      } else if (/(m.*)/g.test(standardizedApartment)) {
        name = "Madison";
      } else if (/(w.*)/g.test(standardizedApartment)) {
        name = "Washington";
      }

      const number = /(\d\d?)/g.exec(standardizedApartment)[0];

      const realApartment = name + " " + number;
      if (!acc[realApartment]) {
        acc[realApartment] = { name: realApartment, members: [] };
      }

      acc[realApartment].members.push(curr);
    },

    groupBy(field) {
      let reducer;
      if (field == "apartment") {
        reducer = (acc, curr) => {
          let apartment = curr.person.apartment;
          if (!apartment) {
            // bad address? ask survey
            if (curr.survey) apartment = curr.survey.apartment || null;
            else console.log("No idea where this person belongs", curr.person);
          }
          if (apartment) {
            this.addToSimilarApartment(acc, curr, apartment);
          }
          return acc;
        };
      } else {
        reducer = (acc, curr) => {
          if(!acc.group) {
            acc.group = {
              name: 'Directory',
              members: []
            }
          }
          acc.group.members.push(curr);
          return acc;
        };
      }

      let grouped =  this.directory.reduce(reducer, {});
      console.log("XXXXXXX", grouped);
      // sort groups by group name
      let groups = Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));

      // sort group members by last name
      groups.forEach(group => group.members.sort((a, b) => {
        try {
        return a.person.lastName.localeCompare(b.person.lastName)
        } catch(e) {
          console.error("undefined:", a.person, b.person);
        }
      }))
      this.groups = groups;
    },
    createWordDoc(name) {
      const doc = new Document(undefined, {top:0.5, bottom:0.75});

      doc.Styles.createParagraphStyle("Heading1", "Heading 1")
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(28)
        .color("black")
        .spacing({ after: 10 });

      doc.Styles.createParagraphStyle("info", "info")
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(14);

      const maxPerRow = 6;
      this.groups.forEach(group => {
        doc.createParagraph(group.name).center().heading2();

        const members = group.members;
        for(var row = 0; row < members.length; row += 6) {
          const rowMembers = members.slice(row, row + 6);
          
          const table = doc.createTable(2, rowMembers.length)
          rowMembers.forEach((member, index) => {
            if(member.person.photo) {
              const image = Media.addImage(doc, Buffer.from(member.person.photo.data, "base64"), 99, 150,{floating:false});
              table.getCell(0,index).addChildElement(image.paragraph)

              //doc.addImage(image);
            }
            table.getCell(0, index).properties.cellBorder
            .addTopBorder(BorderStyle.NONE)
            .addBottomBorder(BorderStyle.NONE)
            .addStartBorder(BorderStyle.NONE)
            .addEndBorder(BorderStyle.NONE);
            table.getCell(1, index).properties.cellBorder
            .addTopBorder(BorderStyle.NONE)
            .addBottomBorder(BorderStyle.NONE)
            .addStartBorder(BorderStyle.NONE)
            .addEndBorder(BorderStyle.NONE)

            table.getCell(0, index).properties.setWidth(20, 'pct')
            table.getCell(1, index).properties.setWidth(20, 'pct')

            table.getCell(1,index).addContent(new Paragraph(member.person.name).style('info'))
            table.getCell(1,index).addContent(new Paragraph( this.$options.filters.phone(this.getPhone(member)) ).style('info'))
          })
        }
      })

      const packer = new Packer();
      packer.toBlob(doc).then((blob) => {
        // saveAs from FileSaver will download the file
        saveAs(blob, `Directory_${this.filters || "lastname"}.docx`);
      });

    },
    getPhone(p) {
      if(p.survey) {
        return p.survey.phone || p.person.phone
      }
      return p.person.phone;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-layout-item {
  text-align: center;
}
.portrait img {
  height: 150px;
  max-width: 200px;
  max-height: 220px;
}
.apartment {
  margin-bottom: 5px;
  page-break-inside: avoid;
}
.apartment-name {
  margin-bottom: 5px;
}
.person-name {
  white-space: nowrap;
  overflow: hidden;
}
.header-btn {
  margin-left: 20px;
}
.member .actions {
  display: none;
}
.member:hover .actions {
  display: initial;
}
.member:hover .details {
  display: none;
}
</style>

<!-- 
Download all the images script


jQuery("<div><a href='test.com'>Download image</a></div>").appendTo(".photoDirectoryName")
jQuery(".batchphoto").each((index, m) => {
   a = m.querySelector('a')
   a.href= m.querySelector('img').src;
   names =  m.querySelector('b').textContent.split(",")
   a.download = names[1].slice(1) + ' ' + names[0] + '.jpeg'
})

-->