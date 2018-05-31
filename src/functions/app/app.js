import * as functions from "firebase-functions"
import next from "next"
import express from 'express';

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handle = app.getRequestHandler()

const server = express();

server.get('/projects/p/:project', (request, response) => {
      const actualPage = '/project'
      const queryParams = { project: request.params.project }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/admin', (request, response) => {
      const actualPage = '/admin'
      const queryParams = { project: request.params.project}
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/admin/:tab', (request, response) => {
      const actualPage = '/admin'
      const queryParams = { project: request.params.project, tab: request.params.tab}
      app.render(request, response, actualPage, queryParams)
    })/

server.get('/projects/p/:project/joined', (request, response) => {
      const actualPage = '/joined'
      const queryParams = { project: request.params.project}
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/declined', (request, response) => {
      const actualPage = '/declined'
      const queryParams = { project: request.params.project}
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/completed', (request, response) => {
      const actualPage = '/project'
      const queryParams = { project: request.params.project, completed: 'true'}
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/review', (request, response) => {
      const actualPage = '/project-review'
      const queryParams = { project: request.params.project }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/projects/p/:project/review/:status', (request, response) => {
      const actualPage = '/review-status'
      const queryParams = { project: request.params.project, status: request.params.status }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/profile/:user', (request, response) => {
      const actualPage = '/profile'
      const queryParams = { user: request.params.user }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/groups/:groupId', (request, response) => {
      const actualPage = '/group'
      const queryParams = { groupId: request.params.groupId }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/charity/:charityId', (request, response) => {
      console.log('should be project')
      const actualPage = '/charity'
      const queryParams = { charityId: request.params.charityId }
      app.render(request, response, actualPage, queryParams)
    })

server.get('*', (req, res) => handle(req, res));


export let nextApp = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  server(req, res);
});
