// radhe radhe

import { insertRow , checkValueExists , getCellValue , updateCellValue, deleteRow } from "./supabaseController.js"
import dotenv from "dotenv"

dotenv.config()
const mainTable = process.env.SUPABASE_MAIN_TABLE
const historyTable = process.env.SUPABASE_HISTORY_TABLE


export function joinRoomSockCtrl(socket , io) {
    socket.on("joinRoom" , async dets => {
        
        let roomExists = await checkValueExists(mainTable , "roomId" , dets.roomId)

        // check if the room exists
        if (dets.senderFn === "createRoom") {

            if (!roomExists) {
                // inserting as well as checking insertd or not using if 
                await insertRow(mainTable , dets.roomId , [dets.IP])

                if (await checkValueExists(mainTable , "roomId" , dets.roomId)) {
                    
                    // join room
                    socket.join(dets.roomId)
    
                    // send ack
                    socket.emit("joinRoomAck" , {success: true , roomId: dets.roomId})
                }  
            } else {

                socket.emit("joinRoomAck" , {success: false , roomId: dets.roomId})
                
            }
        }

        else if (dets.senderFn === "joinRoom") {
            if (roomExists) {

                let oldUsers = await getCellValue(mainTable , "connectedUsers" , "roomId" , dets.roomId)

                if (oldUsers === null) oldUsers = []

                let newUsers = [...oldUsers , dets.IP]

                await updateCellValue(mainTable , "connectedUsers" , dets.roomId , oldUsers , newUsers)

                // join room
                socket.join(dets.roomId)

                // send ack
                socket.emit("joinRoomAck" , {success: true , roomId: dets.roomId})
                
            }

            else {
                socket.emit("joinRoomAck" , {success: false , roomId: dets.roomId})
            }
        } 
        
        else {
         
            socket.emit("joinRoomAck" , {success: false , roomId: dets.roomId})

        }      

    

    })
}

export function regDevicesinRoom(socket) {
    socket.on("regDevice" , dets => {
        
    })
}

export function roomExistsSockCtrl(socket) {
    socket.on("checkRoomExist" , async dets => {

        if (!await checkValueExists(mainTable , "roomId" , dets.roomId)) {
            socket.emit("ackCheckRoomExist" , {success: true , message: `The room is clear to enter`})
        } else {
            socket.emit("ackCheckRoomExist" , {success: false , message: `The room already exists`})
        }
    })
}

export function txtUploadSockCtrl(socket ,io) {
    socket.on("textUpload" , dets => {
        // join room once again for NO BUGS
        socket.join(dets.roomId)

        // get the text
        io.to(dets.roomId).emit("ackText" , {success:true , text: dets.text , IP: dets.IP})
    })
}

export function getUsersSockCtrl(socket , io) {
    socket.on("getUsers" , async dets => {

        socket.join(dets.roomId)


        let users = await getCellValue(mainTable , "connectedUsers" , "roomId"  , dets.roomId )
        io.to(dets.roomId).emit("ackGetUsers" , {success:true , users: users})
    })
}

export function deleteRoomCtrl(socket , io) {
    socket.on("deleteRoom" , async dets => {
        
        socket.join(dets.roomId)

        let success = await deleteRow(mainTable, "roomId" , dets.roomId)
    
        if (success) io.to(dets.roomId).emit("ackDeleteRoom" , {success: true , roomId: dets.roomId})
        
        else io.to(dets.roomId).emit("ackDeleteRoom" , {success: false , roomId: dets.roomId})
    })
}

export function disConnectCtrl(socket) {
    socket.on("disconnect" , dets =>  null)
}