// radhe radhe

export function roomReqSockCtrl(socket) {
    socket.on("joinRoom" , (dets) => {
        // join room
        socket.join(dets.roomId)
        // send acknowledgement
        socket.emit("joinRoomAck" , {success: true , roomId: dets.roomId})
    })
}

export function regDevicesinRoom(socket) {
    socket.on("regDevice" , (dets) => {
        
    })
}