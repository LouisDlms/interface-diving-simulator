const express = require("express");
const router = express.Router();
const fs = require('fs');
const doctorsPath = './config/doctors.json';
const patientsPath = './config/patients.json';
const dataPath = './data';

router.get("/", (req, res) => {
  res.send({ response: "SocketIO server on" }).status(200);
});

router.get("/launch-app", (req, res) => {
  res.send({ response: "Starting App..." }).status(200);
  console.log("Starting App...")
  var exec = require('child_process').exec;
  exec('\"C:\\Users\\CRC-MINES\\Documents\\Unity Editors\\2019.4.18f1\\Editor\\Unity.exe\" -projectpath \"C:/Users/CRC-MINES/Documents/Unity\ Projects/diving-simulator\" -useHub -hubIPC -cloudEnvironment production -executeMethod SyncProcess.SyncProcess.Start');
  console.log("App started. Do not close this window.")
});

router.get("/users", (req, res) => {
  let users = {}
  fs.readFile(doctorsPath, 'utf8', (err, data) => {
      users.doctors = JSON.parse(data)
      fs.readFile(patientsPath, 'utf8', (err, data) => {
          users.patients = JSON.parse(data)
          res.send(users).status(200);
      })
  })
});

router.get("/data", (req, res) => {
  let dataToSend = []

  fs.readdir(dataPath, { withFileTypes: true }, function(err, tmpData) {
    const lengthData = tmpData.length

    tmpData.filter(dirent => dirent.isDirectory())
    .map(dirent => {
      dat = dirent.name
      jsonContent = {}
      content = dat.split("_") // ID - Date - Users (docteur + patient)
      
      jsonContent.id = content[0]
      jsonContent.date = content[1]
      idUsers = content[2].split("-")

      doctorsJson = fs.readFileSync(doctorsPath, 'utf8')
      doctorsJson = JSON.parse(doctorsJson)
      doctor = doctorsJson.filter(doctor => (doctor.id === parseInt(idUsers[0])))[0]
      jsonContent.doctor = doctor.firstName + " " + doctor.lastName.toUpperCase()

      patientsJson = fs.readFileSync(patientsPath, 'utf8')
      patientsJson = JSON.parse(patientsJson)
      patient = patientsJson.filter(patient => (patient.id === parseInt(idUsers[1])))[0]
      jsonContent.patient = patient.firstName + " " + patient.lastName.toUpperCase()

      dataToSend.push(jsonContent)
    })

    res.send(dataToSend).status(200)
  })
});

module.exports = router;