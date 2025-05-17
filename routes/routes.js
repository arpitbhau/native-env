// radhe radhe

import express from 'express';
import { roomIdController } from '../controllers/routeController.js';

const router = express();


// ejs and static files folder setup
router.set("view engine" , "ejs")
router.use(express.static("./public"))


router.get('/', (req, res) => res.render("index") )

router.get("/room/:roomId" , roomIdController)


export default router