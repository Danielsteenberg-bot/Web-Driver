const {PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const buffer = new Map();

function prepare(session_id, time) {
    time = Math.round(time / 200) * 200;

    const hash = `${session_id}${time}`
    let data = buffer.get(hash)
    
    if (!data) {
        data = { session_id, time }
    }
    
    return [hash, data]
}

function AddSonar(session_id, time, forward, left, right) {
    const [hash, data] = prepare(session_id, time)
    data.sonar_forward = forward
    data.sonar_left = left
    data.sonar_right = right
    buffer.set(hash, data)
}

function AddGps(session_id, time, lat, long) {
    const [hash, data] = prepare(session_id, time)
    data.lat = lat
    data.long = long
    buffer.set(hash, data)
}

function AddRotation(session_id, time, rotation) {
    const [hash, data] = prepare(session_id, time)
    data.rotation = rotation
    buffer.set(hash, data)
}

setInterval(async () => {
    let data = []
    
    buffer.forEach((history) => {
        history.time = new Date(history.time);
        data.push(history)
    })
    
    // console.log("buffer size: " + data.length)

    buffer.clear();
    // let x = await prisma.drivingHistory.createMany({data: data});
    // console.log(x)
}, 5000)

module.exports = {
    AddRotation, AddGps, AddSonar
}