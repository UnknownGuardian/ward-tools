<template>
  <div>
    <div class="md-title">Export Images from Google Drive</div>
    <md-field>
      <label>Single</label>
      <md-file v-model="single" @md-change="readCSV" />
    </md-field>

    <div class="md-body-1">Matched {{ photoCount - unknownPhotos.length }} photos to members.</div>

    <md-table v-if="unknownPhotos.length" :value="unknownPhotos" md-sort="name" md-sort-order="asc">
      <md-table-toolbar>
        <h1 class="md-title">Pictures that could not be automatically matched to a ward member</h1>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Extracted Name" md-sort-by="person">{{ item.person }}</md-table-cell>
        <md-table-cell md-label="File Name" md-sort-by="person">{{ item.filename }}</md-table-cell>
      </md-table-row>
    </md-table>
  
  </div>
</template>

<script>

import * as JSZip from 'jszip'

export default {
  name: 'ImagesImport',
  data () {
    return {
      single: null,
      photoCount: 0,
    };
  },
  computed: {
    unknownPhotos: function() {
      return this.$store.state.unknownPhotos || [];
    }
  },
  methods: {
    async downscaleImage(dataUrl, newWidth, imageType, imageArguments) {
      "use strict";
      var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

      // Provide default values
      imageType = imageType || "image/jpeg";
      imageArguments = imageArguments || 0.7;

      // Create a temporary image so that we can compute the height of the downscaled image.
      const dims = await new Promise((resolve, reject) => {
        image = new Image();
        image.onload = function() {
          resolve({width:image.width, height: image.height})
        }
        image.src = dataUrl;
      })
      oldWidth = dims.width;
      oldHeight = dims.height;
      newHeight = Math.floor(oldHeight / oldWidth * newWidth)

      // Create a temporary canvas to draw the downscaled image on.
      canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the downscaled image on the canvas and return the new data URL.
      ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      newDataUrl = canvas.toDataURL(imageType, imageArguments);
      return newDataUrl;
    },

    async readCSV(fileList) {
      const photos = [];
      console.log("Files:", fileList);
      const reader = new JSZip();
      const zip = await reader.loadAsync(fileList[0])

      const keys = Object.keys(zip.files);
      console.log(zip, "Amount:", keys.length);
      for(var index = 0; index < keys.length; index++) {
        const key = keys[index]; 
        this.photoCount++

        const file = zip.files[key];
        const filename = file.name;
        const extension = filename.split(".").slice(-1)[0];
        const mediatype = 'image/' + extension == "png" ? "png" : "jpeg"
        try {
          let nameMatching = /.*\/(.*)\./g.exec(filename);
          if(!nameMatching || nameMatching.length != 2)
            continue;
          

          let person = nameMatching[1]
          let data = await zip.file(filename).async("base64");
          let url = 'data:' + mediatype + ';base64,';
          // resize
          if(zip.files[filename]._data.uncompressedSize > 1000000) {
            //console.log("Resizing", person, "since it is",zip.files[filename]._data.uncompressedSize, "bytes")
            const newImage = await this.downscaleImage(url + data, 400, mediatype)
            //console.log("--->", newImage.substring(0, 100));
            const parts = newImage.split(";base64,")
            url = parts[0] + ';base64,';
            data = parts[1];
          }



          this.$store.commit('photo', {
            id: index,
            url,
            data,
            filename,
            person,
          })
        } catch(err) {
          console.error(err);
        }
        
      }

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-card {
  margin-top: 30px;
}
</style>
