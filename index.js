
const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')


const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))



app.get('/api/persons', (req, res) => {
  Person.find({}).then(p => {
  	res.json(p.map(s => s.toJSON()))
  })
})

app.get('/api/info', (req, res) => {
	const date = new Date()
	res.send(`
		<p>Phonebook has info for ${Person.length} people</p>
         <p>${date}</p>
		`)
})


app.post('/api/persons', (request, response) => {
	const body = request.body

	if(body.name === undefined) {
		return response.status(400).json({
			error: 'must include a name'
		})
	}

	const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedName => {
    response.json(savedName.toJSON())
  })

})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(p => {
      if (p) {
        response.json(p.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updated => {
    response.json(updated)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error) 
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, homma toimii.`)
})