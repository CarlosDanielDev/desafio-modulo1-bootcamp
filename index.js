const express = require('express')

const server = express()
let numberOfRequests
server.use(express.json())
const projects = []
server.use((req, res, next)=>{
  numberOfRequests++
  console.time('Request')
  console.log(`Método: ${req.method}; URL: ${req.url}; Numero de requests: ${numberOfRequests}`)
  next()
  console.timeEnd('Request')
})
function checkIdExists(req, res, next){
  if(!req.params.id){
    return res.status(400).json({error: 'ID is required'})
  }
  return next()
}
function checkParams(req, res, next){
  if(!req.body.id || !req.body.title){
    return res.status(400).json({error: 'ID and TITLE is required'})
  }
  return next()
}
function checkIdInArray(req, res, next){
  const {id} = req.params
  const index = projects.findIndex(e=>e.id == id)
  if(!projects[index]){
    return res.status(400).json({error: 'ID does not exists'})
  }
  return next()
}
// POST: /projects
server.post('/projects', checkParams, (req, res)=>{
  const { id, title, tasks } = req.body
  projects.push({id, title, tasks})
  return res.send()
})


//GET: /projects
server.get('/projects', (req, res)=>{
  return res.send(projects)
})

//PUT: /projects/:id
server.put('/projects/:id', checkIdInArray, checkIdExists, (req, res)=>{
  const { title } = req.body
  const {id} = req.params
  const index = projects.findIndex(e => e.id == id )
  projects[index].title = title 
  return res.json(projects)

})
server.delete('/projects/:id', checkIdInArray, checkIdExists, (req, res)=>{
  const {id} = req.params

  const index = projects.findIndex(e => e.id == id)

  projects.splice(index, 1)
  
  return res.json()

})
server.post('/projects/:id/tasks', checkIdInArray, checkIdExists, (req, res)=>{
  const { id } = req.params
  const {title} = req.body
  const index = projects.findIndex(e=>e.id == id)

  projects[index].tasks = [title]

  return res.json(projects)

})

server.listen(4444)