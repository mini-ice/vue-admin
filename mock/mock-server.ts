import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression' //压缩请求体
import morgan from 'morgan' //记录日志
import cors from 'cors'
import http from 'http'
import path from 'path'
import yaml from 'yamljs'
import * as api from './api'
import { accessTokenAuth } from './security'
const multer = require('multer')
const upload = multer({ dest: './static/' })

const app = express()
app.use(upload.any())
const port = 8000
const { connector, summarise } = require('swagger-routes-express')

// Compression
app.use(compression())
// Logger
app.use(morgan('dev'))
// Enable CORS
app.use(cors())
// POST, PUT, DELETE body parser
app.use(bodyParser.json({ limit: '20mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: false
  })
)
// No cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Pragma', 'no-cache')
  res.header('Expires', '-1')
  next()
})

// Read and swagger config file
const apiDefinition = yaml.load(path.resolve(__dirname, 'swagger.yml'))
// Create mock functions based on swaggerConfig
const options = {
  security: {
    AccessTokenAuth: accessTokenAuth
  }
}

const connectSwagger = connector(api, apiDefinition, options)
connectSwagger(app)
// Print swagger router api summary
const apiSummary = summarise(apiDefinition)
console.log(apiSummary)

// Catch 404 error
app.use((req, res) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})

// Event listener for HTTP server "error" event.
function onError(this: any, error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  const map = new Map([
    [
      'EACCES',
      () => {
        console.error('Express ERROR (app) : %s requires elevated privileges', bind)
        process.exit(1)
      }
    ],
    [
      'EADDRINUSE',
      () => {
        console.error('Express ERROR (app) : %s is already in use', bind)
        process.exit(1)
      }
    ],
    [
      'default',
      () => {
        throw error
      }
    ]
  ])
  const errorEvent: any = map.get(error.code)
  errorEvent.call(this)
}

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
console.log('Mock server started on port ' + port + '!')