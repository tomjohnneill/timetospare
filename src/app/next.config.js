const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssModules: false,
  distDir: "../../dist/functions/next",
})
