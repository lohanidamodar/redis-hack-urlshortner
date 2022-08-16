import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { router as urlRouter } from './routers/url-router.js'
import { baseUrlMiddleware } from './middlewares/middleware.js'

/* create an express app and use JSON */
const app = new express()
app.use(cookieParser())
app.use(express.json())
app.use(baseUrlMiddleware)

var corsOptions = {
    origin: true,
    credentials: true,
}
app.use(cors(corsOptions))

app.use('/', urlRouter)

/* start the server */
const port = process.env._APP_PORT ?? 8000;
app.listen(port)
console.log("Server started at " + port);

export default app;