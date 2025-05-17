// radhe radhe

export function roomIdController(req , res) {
    // checking if the roomId in route is no. or not

    let roomId = req.params.roomId

    if (!isNaN(+roomId)) {
        res.render("room" , {roomId: roomId})
    } else {
        res.send("Invalid room number <br><a href='/'>go back</a>") 
    }
}