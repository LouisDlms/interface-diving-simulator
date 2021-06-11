import React from "react"
import { Card, Form, Col, Button, InputGroup } from "react-bootstrap"
import { GiDoctorFace } from "react-icons/gi"
import { BsPersonLinesFill } from "react-icons/bs"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { Link } from "react-router-dom"

class NewEntry extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            doctor: {
                firstName: "",
                lastName: ""
            },
            patient: {
                firstName: "",
                lastName: "",
                birthDay: "",
                sex: "M",
                weight: 0,
                height: 0
            },
            socket: this.store.getState().socket
        }
        this.unsubscribe = () => {}
    }

    updateField = (field, e) => {
        switch(field) {
            case "doctor-firstName":
                this.state.doctor.firstName = e.target.value
                break

            case "doctor-lastName":
                this.state.doctor.lastName = e.target.value
                break

            case "patient-firstName":
                this.state.patient.firstName = e.target.value
                break
            
            case "patient-lastName":
                this.state.patient.lastName = e.target.value
                break

            case "patient-birthDay":
                this.state.patient.birthDay = e.target.value
                break

            case "patient-sex":
                this.state.patient.sex = e.target.value
                break

            case "patient-weight":
                this.state.patient.weight = parseInt(e.target.value)
                break

            case "patient-height":
                this.state.patient.height = parseInt(e.target.value)
                break
        }
    }

    saveDoctor = (e) => {
        this.state.socket.emit("dashboard-new-doctor", this.state.doctor)
    }   

    savePatient = (e) => {
        this.state.socket.emit("dashboard-new-patient", this.state.patient)
    }

    render() {
        return (
            <div className="h-vh">
                <div className="center-box">
                    <Card className="mb-5">
                        <Card.Header as="h5"><GiDoctorFace/>&nbsp;&nbsp;Ajout d'un docteur</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control onChange={ (e) => this.updateField("doctor-firstName", e) }/>
                                    </Col>

                                    <Col>
                                        <Form.Label>Nom</Form.Label>
                                        <Form.Control onChange={ (e) => this.updateField("doctor-lastName", e) }/>
                                    </Col>
                                </Form.Row>
                                <Link to="/" onClick={ this.saveDoctor }>
                                    <Button variant="primary" className="mt-4 text-left align-middle">
                                            <AiOutlinePlusCircle className="control-button"/>&nbsp;Nouvelle entrée
                                    </Button>
                                </Link>
                            </Form>
                        </Card.Body>
                    </Card> 

                    <Card>
                        <Card.Header as="h5">
                            <BsPersonLinesFill/>&nbsp;&nbsp;Ajout d'un patient
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={ this.savePatient }>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="firstName">
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control onChange={ (e) => this.updateField("patient-firstName", e) }/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="lastName">
                                        <Form.Label>Nom</Form.Label>
                                        <Form.Control onChange={ (e) => this.updateField("patient-lastName", e) }/>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridAddress1">
                                    <Form.Label>Date de naissance</Form.Label>
                                    <Form.Control type="date" onChange={ (e) => this.updateField("patient-birthDay", e) } />
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>Sexe</Form.Label>
                                        <Form.Control as="select" onChange={ (e) => this.updateField("patient-sex", e) }>
                                            <option value="M">M</option>
                                            <option value="F">F</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Poids</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                aria-describedby="basic-addon1"
                                                onChange={ (e) => this.updateField("patient-weight", e) } />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon1">kg</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Taille</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                aria-describedby="basic-addon2"
                                                onChange={ (e) => this.updateField("patient-height", e) } />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>

                                <Link to="/" onClick={ this.savePatient }>
                                    <Button variant="primary" className="mt-4 text-left align-middle">
                                            <AiOutlinePlusCircle className="control-button"/>&nbsp;Nouvelle entrée
                                    </Button>
                                </Link>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default NewEntry