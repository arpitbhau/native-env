// radhe radhe

import supabase from "../supabase/supabaseConfig.js"

export async function getColumnValues(tableName, columnName) {
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
  
    if (error) return false
  
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
  
    if (error) return error

    return data[targetColumn]
}

export async function checkValueExists(tableName, columnName, valueToCheck) {
    
    // usage: if (await fn(args) {})
    
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .eq(columnName, valueToCheck)
      .limit(1) // Only need to check one match
  
    if (error) return false
  
    return data.length > 0
}

export async function updateCellValue(tableName, targetColumn, referenceColumn, referenceValue, newValue) {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [targetColumn]: newValue })
      .eq(referenceColumn, referenceValue)
      .select() // Optional: return updated row(s)
  
    if (error) return false;
  
    return !!data

    // what's in data?
    // [
    //     {
    //       id: 2,
    //       name: 'B-Block',
    //       status: 'active' // This reflects the updated value
    //     }
    // ]
}

export async function insertRow(tableName, roomId, connectedUsers) {
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
  
    if (error) return false
  
    return !!data[0] // Return the inserted row
}

export async function countRows(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true }) // Only get count, not data

  if (error) return false

  return count
}

export async function deleteRow(tableName, referenceColumn, referenceValue) {
  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .eq(referenceColumn, referenceValue)

  if (error) {
    console.error('Delete error:', error)
    return false
  }

  return !!data // this contains the deleted row(s)
}

export async function getFilteredRow(table, referenceColumn, referenceValue) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(referenceColumn, referenceValue)
    .single()

  if (error) return false

  // Destructure to remove 'id' and 'created_at'
  const { id, created_at, ...filteredRow } = data
  return filteredRow
}
