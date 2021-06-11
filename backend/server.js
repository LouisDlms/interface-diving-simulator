const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const fs = require('fs');
const doctorsPath = './config/doctors.json';
const patientsPath = './config/patients.json';

process.env.TZ = 'Europe/Paris'
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});
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
                users = {}
                fs.readFile(doctorsPath, 'utf8', (err, data) => {
                    users.doctors = JSON.parse(data)
                    fs.readFile(patientsPath, 'utf8', (err, data) => {
                        users.patients = JSON.parse(data)
                        socket.emit("get-users", users)
                    })
                })
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
    socket.on("dashboard-new-doctor", (data) => {
        console.log("Dashboard : New Doctor")
        fs.readFile(doctorsPath, 'utf8', function readFileCallback(err, doctors) {
            if (err) {
                console.log(err);
            } else {
                doctors = JSON.parse(doctors)
                data.id = doctors[doctors.length - 1].id + 1
                doctors.push(data)
                fs.writeFile(doctorsPath, JSON.stringify(doctors, null, 2), 'utf8', err => {
                    if (err) throw err;
                    console.log('File has been saved!');
                });
            }
        });

        
    })
    socket.on("dashboard-new-patient", (data) => {
        console.log("Dashboard : New Patient")
        fs.readFile(patientsPath, 'utf8', function readFileCallback(err, patients) {
            if (err) {
                console.log(err);
            } else {
                patients = JSON.parse(patients)
                data.id = patients[patients.length - 1].id + 1
                patients.push(data)
                fs.writeFile(patientsPath, JSON.stringify(patients, null, 2), 'utf8', err => {
                    if (err) throw err;
                    console.log('File has been saved!');
                });
            }
        });
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