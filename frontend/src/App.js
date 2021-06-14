import './App.css';
import React from "react";
import { BrowserRouter as Router , Route } from "react-router-dom";
import Fader from "react-fader";
import Switch from "react-router-transition-switch";
import Dashboard from "./Dashboard"
import Home from "./Home.js";
import NewEntry from "./NewEntry";
import MedicalReport from "./MedicalReport";
import Export from "./Export"
import ExportId from "./ExportId"
import { Col } from "react-bootstrap";
import store from "./store"

class App extends React.Component {
  componentDidMount() {
    store.getState().socket.emit("who", "dashboard")

    store.getState().socket.on("ping", data => {
      store.dispatch({ type: 'status/server/ok'})
    });
  }

  render() {
    return (
      <Col className="App h-100 align-center bg-styled">
        <Router>
          <Switch component={ Fader }>
              <Route path="/dashboard">
                <Dashboard
                  store={ store }
                />
              </Route>
              <Route path="/export/:id" render={({match}) => (
                <ExportId
                  store={ store }
                  id={ match.params.id }
                />
              )}/>
              <Route path="/export">
                <Export
                  store={ store }
                />
              </Route>
              <Route path="/new-entry">
                <NewEntry
                  store={ store }
                />
              </Route>
              <Route path="/medical-report">
                <MedicalReport
                  store={ store }
                />
              </Route>
              <Route>
                <Home
                  store={ store }
                />
              </Route>
          </Switch>
        </Router>
      </Col>
    );
  }
}

export default App;
