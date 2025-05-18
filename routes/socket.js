// radhe radhe

import { joinRoomSockCtrl , disConnectCtrl , roomExistsSockCtrl , txtUploadSockCtrl, getUsersSockCtrl } from "../controllers/socketController.js";

function roomReqSocket(io) {
    io.on("connection", (socket) => {

        joinRoomSockCtrl(socket , io)

        roomExistsSockCtrl(socket)

        txtUploadSockCtrl(socket , io)

        getUsersSockCtrl(socket , io)

        disConnectCtrl(socket)

    });
}


// main socket fn to export
export function socketRoutes(io) {
    roomReqSocket(io)
}

