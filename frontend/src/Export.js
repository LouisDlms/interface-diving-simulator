import React from "react"
import { Card, Table } from "react-bootstrap"
import { Link } from "react-router-dom"

class Export extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            data: []
        }
        this.unsubscribe = () => {}
    }

    componentDidMount() {
        console.log(this.store.ENDPOINT)
        fetch("http://localhost:4001/data").then(response => {
            return response.json()
        }).then(response => {
            this.setState({ data: response })
        })
    }

    render() {
        return (
            <div className="h-vh">
                <div className="center-box">
                    <Card>
                        <Card.Header as="h5">
                            Exportation des données
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Docteur</th>
                                        <th>Patient</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.data.length ? this.state.data.map(data => (
                                        <Link to={"/export/" + data.id}>
                                            <tr>
                                                <td>{ data.id }</td>
                                                <td>{ data.date }</td>
                                                <td>{ data.doctor }</td>
                                                <td>{ data.patient }</td>
                                            </tr> 
                                        </Link>
                                    )) : (
                                        <tr>
                                            <td colSpan="4">Chargement en cours...</td>
                                        </tr> 
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Export