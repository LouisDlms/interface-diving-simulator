const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

process.env.TZ = 'Europe/Paris'
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

let interval;
let status = {
    app: 0,
    dashboard: 0,
    bpmSensor: 0,
    breathSensor: 0
}
let simulationStart = 0;
let bpm = 0;

const lengthData = 50;

let lastBpmData = []

io.on("connection", (socket) => {
    console.log("Someone connected, waiting for identification")
    socket.on("who", (data) => {
        switch(data) {
            case "dashboard":
                console.log("Dashboard connected!")
                status.dashboard = socket.id

                // Server Clock
                if (interval) {
                    clearInterval(interval);
                }
                interval = setInterval(() => getApiAndEmit(socket), 1000);
                break
            case "app":
                console.log("App connected!")
                status.app = socket.id
                break
            default:
                console.log("Can't verify identity")
                break
        }
                
        if(status.app !== 0 && status.dashboard !== 0) {
            console.log("Sync done!")
            if(simulationStart === 0) {
                simulationStart = new Date()
            }
            io.emit("sync", simulationStart)

        }
    })

    socket.on("app-play", () => {
        console.log("Dashboard > App : Play")
        io.emit("app-play")
    })
    socket.on("app-pause", () => {
        console.log("Dashboard > App : Pause")
        io.emit("app-pause")
    })
    socket.on("app-stop", () => {
        console.log("Dashboard > App : Stop")
        io.emit("app-stop")
    })

    socket.on("disconnect", () => {
        // Search for the origin: can emit ping and see the response - if someone doesnt answer, that's the one who has disconnected
        console.log("Someone disconnected");
        // clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const data = {
        deltaTime: 0,
        bpmReady: status.bpmSensor,
        bpm: lastBpmData
    }

    if(simulationStart !== 0) {
        data.deltaTime = ((new Date()) - simulationStart)
    }

    socket.emit("ping", data)
};

// BPM Sensor
let sp = new SerialPort("COM4", {
    baudRate: 9600
});
const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));

sp.on("open", function() {
    console.log('COM4 opened (first USB port on the front of the computer)');
    status.bpmSensor = 1;
    parser.on('data', function(data) {
        console.log('Data received from COM4: ' + data);
        if(simulationStart !== 0) {
            const serverClock = (new Date()) - simulationStart;
            if(lastBpmData.length >= lengthData) {
                lastBpmData.shift();
            }
            lastBpmData.push({
                x: serverClock,
                y: parseInt(data, 10)
            });
        }
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));