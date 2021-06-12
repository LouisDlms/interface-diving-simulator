import React, { useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Form } from "react-bootstrap"
import { VscCircleFilled } from "react-icons/vsc"
import { FaPlay, FaPause, FaStop } from "react-icons/fa"
import { GiDoubleFish, GiFishingBoat, GiTurtle, GiDoctorFace } from "react-icons/gi"
import { BsMicFill, BsPersonLinesFill } from "react-icons/bs"
import { RiHeadphoneFill } from "react-icons/ri"
import {
    XYPlot,
    XAxis,
    YAxis,
    makeWidthFlexible,
    makeHeightFlexible,
    VerticalGridLines,
    HorizontalGridLines,
    LineSeries,
    ChartLabel
  } from "react-vis";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom"

const FlexibleXYPlot = makeHeightFlexible(makeWidthFlexible(XYPlot)); 

const ENDPOINT = "http://localhost:4001"

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.store = props.store
        this.unsubscribe = () => {}
        this.state = this.store.getState()
    }

    componentDidMount() {
        fetch(ENDPOINT + "/launch-app")
        this.store.dispatch({ type: 'status/app/sync' })

        this.unsubscribe = this.store.subscribe(() => {
          this.setState(this.store.getState())
        })
        
        this.state.socket.on("ping", data => {
            if(data !== undefined) {
                this.store.dispatch({ type: 'serverClock/update', payload: data.deltaTime })
                if(data.bpmReady === 1) {
                    this.store.dispatch({ type: 'status/bpm/ok' })
                    this.store.dispatch({ type: 'bpm/update', payload: data.bpm })
                }
            }
        });

        this.state.socket.on("sync", data => {
            this.store.dispatch({ type: 'status/app/ok' })
            this.store.dispatch({ type: 'simulationStart/set', payload: data })
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    getInfo(who) {
        let status = (who === "server") ? this.state.status.server : this.state.status.app

        switch(status) {
          case 0:
              return ["red", "Arrêt"]
          case 1:
              return ["orange", "Synchronisation en cours"]
          case 2:
              return ["green", "OK"]
        }
    }

    getSensorStatus(who) {
        let status = (who === "bpm") ? this.state.status.bpm : this.state.status.breath

        switch(status) {
          case 0:
              return "red"
          case 1:
              return "green"
        }
    }

    appPlay = () => {
        console.log("Play")
        this.state.socket.emit("app-play")
    }

    appPause = () => {
        console.log("Pause")
        this.state.socket.emit("app-pause")
    }

    appStop = () => {
        console.log("Stop")
        this.state.socket.emit("app-stop")
    }

    render() {
        console.log( this.state.sensors.bpm )
        return (
            <Container fluid className="h-vh bg-white">
                <Helmet>
                    <title>Tableau de bord - Plongée Virtuelle</title>
                </Helmet>

                <Row className="h-45">
                    <Col xs={8}>
                        {/* ECG */}
                        <FlexibleXYPlot className="w-100 h-100">
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <ChartLabel 
                                text="Temps (s)"
                                className="alt-x-label"
                                includeMargin={false}
                                xPercent={0.025}
                                yPercent={1.01}
                            />
                            <ChartLabel 
                                text="BPM"
                                className="alt-y-label"
                                includeMargin={false}
                                xPercent={0.06}
                                yPercent={0.06}
                                style={{
                                transform: 'rotate(-90)',
                                textAnchor: 'end'
                                }}
                            />
                            <LineSeries
                                curve={'curveMonotoneX'}
                                data={ this.state.sensors.bpm.length ? this.state.sensors.bpm : [{x:0, y:0}]}
                            />
                            { /* Status */ }
                            <VscCircleFilled color={ this.getSensorStatus("bpm") } className="led-chart"/>
                        </FlexibleXYPlot>
                    </Col>
                    <Col>
                        { /* About the current simulation */ }
                        <Card className="mt-2">
                            <Card.Body>
                                <Card.Title>Temps écoulé : { this.state.serverClock.hours }h{ this.state.serverClock.minutes }min{ this.state.serverClock.seconds }s</Card.Title>
                                { (this.state.simulationStart === 0) ? "En attente de synchronisation" : "Simulation démarrée à " + this.state.simulationStart }
                                <br/><strong>Phase 0 - Synchronisation</strong>
                            </Card.Body>
                        </Card>

                        { /* Communication */ }
                        <Card className="mt-2">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Interagir avec le patient</Card.Title>
                                <div className="d-flex">
                                    <BsMicFill className="control-button mr-3"/>
                                    <Form.Control type="range" />
                                </div>
                                <div className="d-flex">
                                    <RiHeadphoneFill className="control-button mr-3"/>
                                    <Form.Control type="range" />
                                </div>
                                <Button className="align-self-end">Parler au patient</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="h-45">
                    <Col xs={8}>
                        {/* Respiration */}
                        <FlexibleXYPlot className="w-100 h-100">
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <ChartLabel 
                                text="Temps (s)"
                                className="alt-x-label"
                                includeMargin={false}
                                xPercent={0.025}
                                yPercent={1.01}
                            />

                            <ChartLabel 
                                text="Respiration"
                                className="alt-y-label"
                                includeMargin={false}
                                xPercent={0.06}
                                yPercent={0.06}
                                style={{
                                transform: 'rotate(-90)',
                                textAnchor: 'end'
                                }}
                            />
                            <LineSeries
                                curve={'curveMonotoneX'}
                                data={ this.state.sensors.breath.length ? this.state.sensors.breath : [{x:0, y:0}]}
                            />
                            { /* Status */ }
                            <VscCircleFilled color="red" className="led-chart"/>
                        </FlexibleXYPlot>
                    </Col>
                    <Col>
                        { /* Events panel */ }
                        <Card className="mt-2">
                            <Card.Body>
                                <Card.Title>Déclencher des évènements</Card.Title>
                                <ListGroup as="ul">
                                    <ListGroup.Item as="li" className="event-button">
                                        <GiDoubleFish className="control-button"/>Banc de poissons
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" className="event-button">
                                        <GiFishingBoat className="control-button"/>Bateau à proximité
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" className="event-button">
                                        <GiTurtle className="control-button"/>TORTUE !
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="bg-secondary h-10">
                    <Col className="d-flex flex-column justify-content-center text-light">
                        <div className="d-flex">
                            <VscCircleFilled color={ this.getInfo("app")[0] } className="w-2 h-2"/>
                            &nbsp;Simulation :&nbsp;<strong>{ this.getInfo("app")[1] }</strong>
                        </div>
                        <div className="d-flex">
                            <VscCircleFilled color={ this.getInfo("server")[0] } className="w-2 h-2"/>
                            &nbsp;Serveur IO :&nbsp;<strong>{ this.getInfo("server")[1] }</strong>
                        </div>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-center text-light">
                        <FaPlay className="control-button" onClick={ this.appPlay } />
                        <FaPause className="control-button" onClick={ this.appPause } />
                        <Link to="/medical-report">
                            <FaStop className="control-button" onClick={ this.appStop } />
                        </Link>
                    </Col>
                    <Col className="d-flex flex-column align-items-end justify-content-center text-light">
                        <div>
                            <GiDoctorFace className="user-icon"/>&nbsp;
                            <span className="align-middle ml-1 fs-5">
                                { this.state.doctor.firstName + " " + this.state.doctor.lastName.toUpperCase() }
                            </span>
                        </div>
                        <div>
                            <BsPersonLinesFill className="user-icon"/>&nbsp;
                            <span className="align-middle ml-1 fs-5">
                                { this.state.patient.firstName + " " + this.state.patient.lastName.toUpperCase() }
                            </span>
                        </div>    
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;