const ngrok = require('ngrok')

ngrok.connect(3000, (err, url) => {
  if (err) {
    throw err
  }

  console.log('#########################')
  console.log('running tunnel at: ', url)
  console.log('#########################')
})
