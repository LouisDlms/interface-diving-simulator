import React from "react"
import { Card, Form, Col, Button, InputGroup } from "react-bootstrap"
import { GiDoctorFace } from "react-icons/gi"
import { Link } from "react-router-dom"

class MedicalReport extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            medicalReport: {
                commentary: ""
            },
            socket: this.store.getState().socket
        }
        this.unsubscribe = () => {}
    }

    updateField = (field, e) => {
        switch(field) {
            case "commentary":
                this.state.medicalReport.commentary = e.target.value
                break
            default:
                break
        }
    }

    save = (e) => {
        this.state.socket.emit("dashboard-medical-report", this.state.medicalReport)
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
                                <Form.Group controlId="formGeneralCommentary">
                                    <Form.Label>Commentaire général</Form.Label>
                                    <Form.Control as="textarea" rows={4} onChange={ (e) => this.updateField("commentary", e) } />
                                </Form.Group>

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