<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400">
        <v-img height="200px"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg">
          <v-card-title class="white--text mt-8">
            <p class="ml-3">
              Les animations du Parc
            </p>
          </v-card-title>
        </v-img>
        <v-card-text>
          <v-timeline align-top dense>
            <v-timeline-item v-for="event in events" :key="event.id" color="orange">
              <div>
                <div class="font-weight-normal">
                  {{ event.begin_date }} <strong>{{ event.name.fr }}</strong>
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
    events: {},
  }),
  mounted() {
    this.gta_url = this.$route.query.gta_url || 'https://geotrekdemo.ecrins-parcnational.fr';
    this.getEvents();
  },
  methods: {

    getEvents() {
      fetch(`${this.gta_url}/api/v2/touristicevent/`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          // Order data

          this.events = data.results.sort((a, b) => a.begin_date - b.begin_date);
        });
    }
  }
}
</script>