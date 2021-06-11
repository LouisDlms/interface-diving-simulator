import './App.css';
import React from "react";
import { BrowserRouter as Router , Route } from "react-router-dom";
import Fader from "react-fader";
import Switch from "react-router-transition-switch";
import Dashboard from "./Dashboard"
import Home from "./Home.js";
import NewEntry from "./NewEntry";
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
              <Route path="/export">
                {/* <Export/> */}
              </Route>
              <Route path="/new-entry">
                <NewEntry
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
