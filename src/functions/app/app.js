import * as functions from "firebase-functions"
import next from "next"
import express from 'express';

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handle = app.getRequestHandler()

const server = express();


server.get('/profile/:user', (request, response) => {
      const actualPage = '/profile'
      const queryParams = { user: request.params.user }
      app.render(request, response, actualPage, queryParams)
    })

server.get('/', (req, res) => {
  res.set('Vary', 'User-Agent')
  return handle(req, res)
});

server.get('*', (req, res) => handle(req, res));


export let nextApp = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=5000');
  server(req, res);
});
