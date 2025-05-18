// radhe radhe

import { getCellValue, updateCellValue } from "../controllers/supabaseController.js"
import dotenv from "dotenv"

dotenv.config()

const mainTable = process.env.SUPABASE_MAIN_TABLE

export async function setMessage(req , res) {
    const {text , roomId , IP} = req.body

    let oldTexts = await getCellValue(mainTable , "texts" , "roomId" , roomId)

    if (oldTexts === null) oldTexts = []


    let newTexts = [...oldTexts , text]
    
    let success = await updateCellValue(mainTable , "texts" , "roomId" , roomId , newTexts)
    

    if (success) res.send({success: success})
    else res.send({success: false})
}