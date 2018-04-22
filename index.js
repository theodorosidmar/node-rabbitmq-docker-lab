const ampq = require('amqplib/callback_api')
const express = require('express')
const QUEUE_NAME = 'queue-sample'

ampq.connect('amqp://rabbitmq', (error, connection) => {
  if (error) {
    throw Error(error)
  }
  console.log('Connected succesfully to RabbitMQ!')
  connection.createChannel((err, channel) => {
    if (err) {
      throw Error(err)
    }
    console.log('Created channel succesfully')

    channel.assertQueue(QUEUE_NAME, { durable: false })
    channel.consume(QUEUE_NAME, (message) => {
      console.log(`Message received: ${message.content.toString()}`)
    }, { noAck: true })

    const app = express()
    app.get('/:message', (req, res) => {
      channel.sendToQueue(QUEUE_NAME, Buffer.from(req.params.message))
      return res.end('Your message was delivered to queue')
    })
    app.use('/', (req, res) => res.end('Working fine'))

    return app.listen(3000, () => console.log('Server running on port 3000!'))
  })
})
