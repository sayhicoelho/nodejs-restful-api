const dotenv = require('dotenv-safe')
const Queue = require('bee-queue')
const queue = new Queue('email')

dotenv.load()

const transporter = require('./utils/mail')

queue.on('ready', () => {
  queue.process((job, done) => {
    console.log(`processing job ${job.id}`)

    const mailOptions = {
      from: job.data.from,
      to: job.data.to,
      subject: job.data.subject,
      html: job.data.html
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        console.error(err)

      done()
    })
  })

  console.log('processing jobs...')
})
