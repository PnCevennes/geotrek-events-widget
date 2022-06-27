module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/geotrek-events-widget/" : "/",

  transpileDependencies: [
    'vuetify'
  ]
}
