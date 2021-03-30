const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URL

console.log(`connecting to ${url}`)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB successfully')
  })
  .catch(error => {
    console.log(`connection to MongoDB failed, ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3, trim: true },
  number: { type: String, required: true, minlength: 8, trim: true }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, personObject) => {
    personObject.id = personObject._id.toString()
    delete personObject._id
    delete personObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)