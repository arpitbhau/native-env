// radhe radhe

import { roomReqSockCtrl } from "../controllers/socketController.js";

function roomReqSocket(io) {
    io.on("connection", (socket) => {
        roomReqSockCtrl(socket)
    });
}


// main socket fn to export
export function socketRoutes(io) {
    roomReqSocket(io)
}

