import React from "react"
import { Card, Table } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"

class ExportId extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            id: props.id
        }
        this.unsubscribe = () => {}
    }

    componentDidMount() {
        this.store.getState().socket.emit("dashboard-export", this.state.id)
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
                            
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default ExportId