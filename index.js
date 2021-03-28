const { response } = require('express');
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(cors())
app.use(express.static('build'))

morgan.token('json', req => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>`)
})

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => id === p.id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const len = persons.length
  persons = persons.filter(p => id !== p.id)
  if (persons.length < len) return res.status(204).end()
  else res.status(404).end()
})

const generateId = () => Math.floor(Math.random() * 10000000000)

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) return res.status(400).json({ error: 'name missing' })
  if (!body.number) return res.status(400).json({ error: 'number missing' })
  const found = persons.filter(person => person.name === body.name)
  if (found.length > 0) return res.status(400).json({ error: 'name must be unique' })
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  res.json(person)
})
  
const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on port ${port}`))