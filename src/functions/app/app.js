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

server.get('*', (req, res) => handle(req, res));


export let nextApp = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  server(req, res);
});
