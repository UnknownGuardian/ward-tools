/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const columns = {
  name: 1,
  gender: 2,
  apartment: 4
};

export default new Vuex.Store({
  state: {
    directory: [],
    people: [],
    ward: [],
    photos: [],
    unknownPhotos: []
  },
  mutations: {
    people(state, people) {
      var generated = people
        .map(p => {
          const sanitizedName = p[1].replace(/[^a-zA-Z0-9\s]/g, " ");
          const nameParts = sanitizedName.split(" ");
          return {
            name: sanitizedName,
            lastName: nameParts[nameParts.length - 1],
            nameParts,
            gender: p[2],
            birthday: p[3],
            apartment: p[4],
            phone: p[5].replace(/[^0-9]/g, ""),
            email: p[6],
            parentsName: p[7],
            homeAddress: p[8],
            previousWard: p[9],
            previousBishop: p[10],
            previousStake: p[11],
            homeStake: p[12],
            student: p[13],
            patriarchalBlessing: p[14],
            mision: p[15],
            misionPlans: p[16],
            religionClass: p[17],
            engaged: p[18],
            employed: p[19],
            previousCallings: p[20],
            interest: p[21],
            howLongToStay: p[22],
            pianoSkills: p[23]
          };
        })
        .reverse();

      // remote duplicates. Since it is reverse, we have their latest entry kept
      const deduped = generated.filter(
        (originalPerson, index, self) =>
          self.findIndex(person => person.name == originalPerson.name) == index
      );

      state.people = deduped;

      state.directory = state.ward.map(person => {
        const survey = state.people.find(
          survey => survey.phone == person.phone || survey.email == person.email
        );
        return { person, survey: survey || {} };
      });
    },
    ward(state, people) {
      var generated = people.slice(1, people.length - 1).map(p => {
        const nameGrouped = /(.*), (.*)/g.exec(p[1]);
        const sanitizedName = nameGrouped[2] + " " + nameGrouped[1];
        const apartmentGroup = /(\d{3}) N(?:.*) (\d{3}) E(?:.*) (?:[#]?)(\d{1,2}) Provo/g.exec(
          p[4]
        );
        let apartment = "";
        if (apartmentGroup) {
          apartment =
            (apartmentGroup[1] == "546"
              ? "Washington"
              : apartmentGroup[1] == "566"
              ? "Madison"
              : "Jefferson") +
            " " +
            apartmentGroup[3];
        }
        const nameParts = sanitizedName.split(" ");
        const lastName = nameParts[nameParts.length - 1];
        return {
          name: sanitizedName,
          lastName,
          nameParts,
          phone: p[2].replace(/[^0-9]/g, ""),
          apartment,
          email: p[3]
        };
      });
      state.ward = generated;
    },
    photo(state, photo) {
      const photoNames = photo.person.split(" ");
      const photoLastName = photoNames[photoNames.length - 1];
      const photoFirstName = photoNames[0];

      const sameLastName = state.ward.filter(p => {
        const minPosition = p.nameParts.length >= 3 ? 1 : 0;
        return p.nameParts.indexOf(photoLastName) > minPosition;
      });

      if (sameLastName.length == 1) {
        /*console.log(
          photoFirstName,
          photoLastName,
          "matches to ",
          sameLastName[0].name
        );*/
        Vue.set(sameLastName[0], "photo", photo);
        return;
      }

      const sameFirstName = sameLastName.filter(p => {
        const sameLastNameFirstname = p.nameParts[0];
        return (
          p.name.indexOf(photoFirstName) == 0 ||
          photoFirstName.indexOf(sameLastNameFirstname) == 0
        );
      });

      if (sameFirstName.length == 1) {
        /*console.log(
          photoFirstName,
          photoLastName,
          "matches to ",
          sameFirstName[0].name
        );*/

        Vue.set(sameFirstName[0], "photo", photo);
        return;
      }

      console.error(
        "Not sure who to match",
        photoFirstName,
        photoLastName,
        "to. There were a possible: ",
        sameLastName.map(p => p.name),
        sameFirstName.map(p => p.name)
      );

      state.unknownPhotos.push(photo);
    }
  }
});
