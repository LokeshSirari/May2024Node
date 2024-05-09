const http = require('http')
const express = require('express')
const app = express()
app.use(express.json());
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())
let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/note/:id', (request, response) => {
    const id = Number(request.params.id);
    const requestedNote = notes.find(note => note.id === id);
    if (requestedNote) {
        response.send(requestedNote);
    } else {
        response.status(404).end();
    }
  });
  
  app.delete('/api/note/delete/:id', (request, response) => {
      const id = Number(request.params.id);
      const updatedNotes = notes.filter(note => note.id !== id);
      notes = updatedNotes;
    //   response.status(204).end();
      response.send({
          status: true,
          message: 'Deletion!!!',
      })
  });
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.post('/api/notes', (request, response) => {
      const newNote = request.body;
      console.log('newNote', newNote);
      response.send(newNote);
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)