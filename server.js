// Jai Shree Ram

import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import router  from "./routes/routes.js"
import { socketRoutes } from './routes/socket.js';



const app = express();
const server = createServer(app);

const io = new Server(server)


// server all routes
app.use("/" , router)

// get the sockets working
socketRoutes(io)





server.listen(3000,  () => {
  console.log('server running at http://localhost:3000');
});