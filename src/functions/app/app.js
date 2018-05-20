import * as functions from "firebase-functions"
import next from "next"
import express from 'express';

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handle = app.getRequestHandler()

const server = express();

server.get('/projects/*', (request, response) => {
      console.log('should be project')
      const actualPage = '/project'
      const queryParams = { project: request.params.project }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/profile/*', (request, response) => {
      console.log('should be project')
      const actualPage = '/profile'
      const queryParams = { user: request.params.user }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/groups/*', (request, response) => {
      console.log('should be project')
      const actualPage = '/group'
      const queryParams = { groupId: request.params.group }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/charity/*', (request, response) => {
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
