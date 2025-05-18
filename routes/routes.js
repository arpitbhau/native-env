// radhe radhe

import express from 'express';
import { roomIdController } from '../controllers/routeController.js';
import { setMessage } from '../api/setTextToDB.js';

const router = express();

router.use(express.json())


// ejs and static files folder setup
router.set("view engine" , "ejs")
router.use(express.static("./public"))


router.get('/', (req, res) => res.render("index") )

router.get("/room/:roomId" , roomIdController)

router.post("/api/setText" , setMessage)


export default router