<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400" class="pa-0">
        <v-img height="200px" v-if="widget_header"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg">
          <v-card-title class="white--text mt-8">
            <p class="ml-3">
              Animations à venir
            </p>
          </v-card-title>
        </v-img>

        <v-card-text class="pa-0">
          <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"
            v-if="loading"></v-progress-linear>
          <a v-for="event in events" :key="event.id" class="mb-3" v-else
            :href="gtr_url + '/event/' + event.id" target="_blank">
            <v-hover v-slot="{ hover }">
              <v-card class="mx-auto d-flex align-end flex-column card-hover" outlined
                :elevation="hover ? 24 : 0" :class="{ 'on-hover': hover }">
                <v-card-text class="pa-0">
                  <v-list-item three-line class="px-1">
                    <v-list-item-avatar tile size="80" class="my-1" color="grey">
                      <v-img :src="get_thumb((event['attachments'] || []))"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content class="py-0">
                      <div>
                        <v-avatar :color="evt_color" size="32px" class="mr-1">
                          <img :src="eventsType[event.type].picto"
                            :title="eventsType[event.type].name">
                        </v-avatar>
                        <strong>{{ event.name.fr }} </strong>
                      </div>
                      <span v-if="event.begin_date_f !== event.end_date_f">
                        du {{ event.begin_date_f }} au {{ event.end_date_f }} </span>
                      <span v-else>le {{ event.begin_date_f }} </span>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-hover>
          </a>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    events: [],
    eventsType: {},
    eventsStore: [],
    display_nb: undefined, // Nb de données à afficher
    loading: true,
    gta_query_params: {}, // Parametres d'appel à l'API v2
    evt_icone: 'mdi-calendar-text',
    evt_color: 'orange',
    widget_header: true
  }),
  mounted() {

    // Traitement des paramètres d'url
    this.gta_url = this.$route.query.gta_url || 'https://geotrek-admin.cevennes-parcnational.net';
    this.gtr_url = this.$route.query.gtr_url || 'https://destination.cevennes-parcnational.fr';
    this.event_api_url = `${this.gta_url}/api/v2/touristicevent/?fields=id,begin_date,end_date,type,name,attachments`

    this.evt_icone = this.$route.query.icone || 'mdi-calendar-text';
    // https://materialdesignicons.com/
    if (!this.evt_icone.startsWith('mdi-')) this.evt_icone = 'mdi-' + this.evt_icone;

    this.evt_color = this.$route.query.color || 'orange';

    if (this.$route.query.nb_days) {
      const dates_after = new Date();
      let dates_before = new Date();
      dates_before.setDate(dates_after.getDate() + parseInt(this.$route.query.nb_days));
      this.gta_query_params['dates_after'] = dates_after.toISOString().split('T')[0];
      this.gta_query_params['dates_before'] = dates_before.toISOString().split('T')[0];
    }

    this.widget_header = (this.$route.query.widget_header !== 'true') ? false : true;

    if (this.$route.query.display_nb) {
      this.display_nb = this.$route.query.display_nb;
    }

    [
      'in-bbox',
      'cities',
      'districts',
      'structures',
      'themes',
      'portals',
      'types'
    ].forEach(key => {
      if (key in this.$route.query) {
        this.gta_query_params[key] = this.$route.query[key]
      }
    })

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

        // Format date
        // Subset
        if (this.display_nb) {
          this.events = this.events.slice(0, this.display_nb);
        }
        this.events = this.events.map(obj => {
          return {
            ...obj,
            begin_date_f: new Date(obj.begin_date).toLocaleDateString(),
            end_date_f: new Date(obj.end_date).toLocaleDateString()
          };
        });
      }
    }
  },
  methods: {
    get_thumb(attachments) {
      if (attachments.length > 0) {
        return attachments[0].thumbnail;
      }
      return undefined;
    },

    requestNextPage(urlNext) {
      return fetch(urlNext, {
        method: 'GET'
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.processEventData(data);
        })
        .catch(err => {
          console.log(`Error: ${err}`)
        });
    },

    processEventData(data) {
      this.eventsStore.push(...data.results);
      if (data.next) {
        this.requestNextPage(data.next);
      }
      else {
        this.getEventsType();
      }
    },

    getEventsType() {
      fetch(this.gta_url + '/api/v2/touristicevent_type')
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.results.forEach(type => {
            this.eventsType[type.id] = {
              'picto': type.pictogram,
              'name': type.type.fr
            }
          });
          console.log(this.eventsType)
          this.loading = false;
        });
    },
    getEvents() {
      const queryString = Object.keys(this.gta_query_params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(this.gta_query_params[key])
      }).join('&');

      fetch(this.event_api_url + '&' + queryString)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.processEventData(data);
        });
    }
  }
}
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: inherit;
}

.card-hove:not(.on-hover) {
  opacity: 0.9;
}
.colorize-orange {
  -webkit-filter: hue-rotate(40deg) saturate(0.5) brightness(390%) saturate(4);
  filter: hue-rotate(40deg) saturate(0.5) brightness(390%) saturate(4);
}
</style>