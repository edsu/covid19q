const express = require('express')
const next = require('next')
const twit = require('twit')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const hashtags = [
  "covid_19",
  "coronavirus",
  "covid-19",
  "covid19"
]

let recentQuestions = []

const twitter = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

// store active clients so we can send them new events
let clients = []
let count = 0

app.prepare().then(() => {
  const server = express()

  server.get('/questions', (req, res) => {

    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers)

    for (let q of recentQuestions) {
      res.write(`data: ${JSON.stringify(q)}\n\n`)
    }

    const clientId = Date.now()
    const newClient = {
      id: clientId,
      res
    }

    clients.push(newClient)

    req.on('close', () => {
      console.log(`${clientId} Connection closed`)
      clients = clients.filter(c => c.id !== clientId)
    })

  })

  function sendQuestion(tweet) {
    // only send if the tweet looks like a question
    const q = getQuestion(tweet)
    if (q) {
      recentQuestions.unshift(q)
      recentQuestions = recentQuestions.slice(0, 10)
      clients.forEach(c => {
        c.res.write(`data: ${JSON.stringify(q)}\n\n`)
      })
    }
  }

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

  const stream = twitter.stream('statuses/filter', {
    track: hashtags.join(',')
  })

  stream.on('tweet', sendQuestion)
})

function getQuestion(t) {
  let tweetText = t.text
  if (t.extended_tweet) {
    tweetText = t.extended_tweet.full_text
  }

  let questionText = null
  if (! t.retweeted_status) {
    const parts = tweetText.split('.')
    for (const part of parts) {
      const question = part.match(/^(.+\?).*/)
      if (question) {
        questionText = question[1]
        break
      }
    }
  }

  if (questionText) {
    return {
      id: t.id_str,
      question: questionText,
      text: tweetText,
      screenName: t.user.screen_name,
      avatar: t.user.profile_image_url_https
    }
  } else {
    return null
  }

}