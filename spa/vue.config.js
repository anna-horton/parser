module.exports = {
    devServer: {
        proxy: {
            "/api/*": {
                target: "http://127.0.0.1:3001",
                secure: false
            }
        }
    },
  chainWebpack: config => {
    config.module.rule('less').use('less-loader').end()
  },
    css: {
        loaderOptions: {
            // pass options to sass-loader
            less: {
                // @/ is an alias to src/
                // so this assumes you have a file named `src/variables.scss`
                data: `@import "@/assets/styles/index.less";`
            }
        }
    }
}
