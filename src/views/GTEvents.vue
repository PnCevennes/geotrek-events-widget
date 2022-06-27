<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400">
        <v-img height="200px"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg">
          <v-card-title class="white--text mt-8">
            <p class="ml-3">
              Animations à venir
            </p>
          </v-card-title>
        </v-img>
        <v-card-text>

          <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"
            v-if="loading"></v-progress-linear>

          <v-timeline align-top dense v-if="!loading">
            <v-timeline-item v-for="event in events" :key="event.id" color="orange"
              icon="mdi-calendar-text">
              <div>
                <div class="font-weight-normal">
                  du {{ event.begin_date }} au {{ event.end_date }} <strong>{{ event.name.fr
                  }}</strong>
                  <a :href="gtr_url + '/event/' + event.id" target="_blank" class="ml-2"
                    role="button">
                    + d'info
                  </a>
                </div>
                <!-- <div>{{ event.description.fr }}</div> -->
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    events: [],
    eventsStore: [],
    loading: true
  }),
  mounted() {
    this.gta_url = this.$route.query.gta_url || 'https://geotrek-admin.cevennes-parcnational.net';
    this.gtr_url = this.$route.query.gta_url || 'https://destination.cevennes-parcnational.fr';
    this.event_api_url = `${this.gta_url}/api/v2/touristicevent/?limit=id,begin_date,end_date,name.fr`

    this.getEvents();
  },
  watch: {
    // whenever question changes, this function will run
    loading(newV) {
      if (newV === false) {
        // Order data
        this.events = this.eventsStore.map(obj => {
          return { ...obj, date: new Date(obj.begin_date) };
        }).sort((a, b) => Number(a.date) - Number(b.date));
        console.log(this.events);
      }
    }
  },
  methods: {
    testNexData(data) {
      console.log(data.results);
      this.eventsStore.push(...data.results);
      if (data.next) {
        this.requestNextPage(data.next);
      }
      else {
        this.loading = false;
      }
    },

    requestNextPage(urlNext) {
      return fetch(urlNext, {
        method: 'GET'
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.testNexData(data);
        })
        .catch(err => {
          console.log(`Error: ${err}`)
        });
    },
    getEvents() {
      fetch(this.event_api_url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.testNexData(data);
        });
    }
  }
}
</script>