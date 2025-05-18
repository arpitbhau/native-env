// radhe radhe

import { checkValueExists, getCellValue } from "./supabaseController.js"
import dotenv from "dotenv"

dotenv.config()

const mainTable = process.env.SUPABASE_MAIN_TABLE

export async function roomIdController(req , res) {
    let roomId = req.params.roomId;
    let roomExists = await checkValueExists(mainTable , "roomId" , roomId);

    if (!isNaN(+roomId)) {

        if (roomExists) {

            // get users
            let users = await getCellValue(mainTable , "connectedUsers" , "roomId" , roomId)

            // get texts
            let texts = await getCellValue(mainTable , "texts" , "roomId" , roomId)


            // Get current time
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

            res.render("room", { roomId: roomId , noOfUsers: users.length , texts: texts , timeString: timeString });
        } else {
            res.send("Room does not exist <br><a href='/'>Go back</a>");
        }

        

    } else {
        res.send("Invalid room number <br><a href='/'>Go back</a>");
    }
}


