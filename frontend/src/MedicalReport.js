import React from "react"
import { Card, Form, Col, Button, InputGroup } from "react-bootstrap"
import { GiDoctorFace } from "react-icons/gi"
import { Link } from "react-router-dom"

class MedicalReport extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            // add fields
        }
        this.unsubscribe = () => {}
    }

    updateField = (field, e) => {
        switch(field) {
            case "":
                break
        }
    }

    save = (e) => {
        this.store.socket.emit("dashboard-medical-report", this.state)
    }

    render() {
        return (
            <div className="h-vh">
                <div className="center-box">
                    <Card>
                        <Card.Header as="h5">
                            <GiDoctorFace />&nbsp;&nbsp;Rapport médical
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={ this.save }>
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

                                <Link to="/" onClick={ this.save }>
                                    <Button variant="primary" className="mt-4">
                                        Terminer
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

export default MedicalReport