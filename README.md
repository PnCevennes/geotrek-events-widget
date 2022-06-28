# geotrek-event


## Wiget liste des événements

Usage : https://pncevennes.github.io/geotrek-events-widget

### Paramètres :
**Genéraux**

| name        |type       | Description |
| ----------- |-----------| ----------- |
| gtr_url     |  url      | Url de geotrek-admin       |
| gta_url     |  url      | Url de geotrek-rando        |
| evt_icone     |  string      | Icone : https://materialdesignicons.com/        |
| color     |  string      | Couleur        |

**Style**

| name              |type          | Description                                          |
| ----------------- |------------- | ---------------------------------------------------- |
| evt_icone         |  string      | Icone : https://materialdesignicons.com/             |
| color             |  string      | Couleur                                              |
| display_nb        |  string      | Nb d'item à afficher                                 |
| widget_header     |  boolean     | Afficher  ou non le header                           |


**Filtres des données**

| name              |type          | Description                                          |
| ----------------- |------------- | ---------------------------------------------------- |
|in-bbox     |  string      | Filter par une enveloppe formatée telle que W-lng,S-lat,E-lng,N-lat (WGS84). Exemple : 1.15,46.1,1.56,47.6.            |
|cities      |  string      | Filtrer par un ou plusieurs id de commune, séparés par des virgules.             |
|districts   |  string      | Filtrer par un ou plusieurs id de secteur, séparés par des virgules.             |
|structures  |  string      | Filtrer par un ou plusieurs id de structure, séparés par des virgules.             |
|themes      |  string      | Filtrer par un ou plusieurs id de thème, séparés par des virgules.             |
|portals     |  string      | Filtrer par un ou plusieurs id de portails, séparés par des virgules.             |
|types        |  string      | Filtrez par un ou plusieurs identifiants de types, séparés par des virgules. OU logiquepour les types dans la même liste, ET pour les types dans des listes différentes             |
|nb_days      |  int      | Filtrer les données des x prochains jours             |


### Exemples

```html
<iframe id="widget-events"
   title="Geotrek events"
   width="300"
   height="600"
   src="https://pncevennes.github.io/geotrek-events-widget/?gta_url=https://geotrekdemo.ecrins-parcnational.fr&gtr_url=https://gtr3demo.ecrins-parcnational.fr">
</iframe>

```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
