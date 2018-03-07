module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactDragDrawer',
      externals: {
        react: 'React'
      }
    }
  }
}
