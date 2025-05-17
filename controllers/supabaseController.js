// radhe radhe

import supabase from "../supabase/supabaseConfig"

export async function getColumnValues(tableName, columnName) {
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
  
    if (error) {
      console.error('Error fetching data:', error)
      return null
    }
  
    // Extract only the column values from the rows
    return data.map(row => row[columnName])
}

export async function getCellValue(tableName, targetColumn, referenceColumn, referenceValue) {

    // A table name

    // A target column name (i.e., the column you want the value from)

    // A reference column name (i.e., which identifies the row)

    // A reference value (i.e., the specific row you want)

    const { data, error } = await supabase
      .from(tableName)
      .select(targetColumn)
      .eq(referenceColumn, referenceValue)
      .single() // Get a single row
  
    if (error) {
      console.error('Error fetching cell value:', error)
      return null
    }
  
    return data[targetColumn]
}

export async function checkValueExists(tableName, columnName, valueToCheck) {
    
    // usage: if (await fn(args) {})
    
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .eq(columnName, valueToCheck)
      .limit(1) // Only need to check one match
  
    if (error) {
      console.error('Error checking value existence:', error)
      return false
    }
  
    return data.length > 0
}

export async function updateCellValue(tableName, targetColumn, referenceColumn, referenceValue, newValue) {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [targetColumn]: newValue })
      .eq(referenceColumn, referenceValue)
      .select() // Optional: return updated row(s)
  
    if (error) {
      console.error('Error updating cell:', error)
      return false
    }
  
    return data

    // what's in data?
    // [
    //     {
    //       id: 2,
    //       name: 'B-Block',
    //       status: 'active' // This reflects the updated value
    //     }
    // ]
}

export async function insertRoom(tableName, roomId, connectedUsers) {
    const { data, error } = await supabase
      .from(tableName)
      .insert([
        {
          roomId: roomId,
          connectedUsers: connectedUsers
          // No need to set timestamp; it will use default now()
        }
      ])
      .select() // Optional: get inserted row(s)
  
    if (error) {
      console.error('Error inserting row:', error)
      return null
    }
  
    return data[0] // Return the inserted row
}
  