const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan('tiny'))
app.use(express.static('build'))

let persons = [
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Kaartamo Risto",
      "number": "040 333",
      "id": 6
    },
    {
      "name": "Elmer VonStrutsenstrandt",
      "number": "060 94766082",
      "id": 8
    },
    {
      "name": "Harman Golgaté",
      "number": "020 112 112",
      "id": 9
    },
    {
      "name": "Mahoumud Mehannanduori",
      "number": "040 05555889",
      "id": 10
    },
    {
      "name": "Philip Gustav Adzvandauri-Strutzenishvili",
      "number": "044 238 7835",
      "id": 11
    }
]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
	const date = new Date()
	res.send(`
		<p>Phonebook has info for ${persons.length} people</p>
         <p>${date}</p>
		`)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)
	
	if(person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
	
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(p => p.id !== id)

	response.status(204).end()
})

randomId = () => {
	return Math.floor(Math.random() * Math.floor(100))
}

app.post('/api/persons', (request, response) => {
	const person = request.body
	console.log(person)

	if(!person.name) {
		return response.status(400).json({
			error: 'must include a name'
		})
	}

	if(persons.map(p => p.name).includes(person.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	const object = {
		name: person.name,
		number: person.number,
		id: randomId(),
	}

	persons = persons.concat(object)

	response.json(object)

})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, homma toimii.`)
})