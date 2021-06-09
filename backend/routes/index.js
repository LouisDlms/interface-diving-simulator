const express = require("express");
const router = express.Router();

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

module.exports = router;