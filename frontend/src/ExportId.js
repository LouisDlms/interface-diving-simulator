import React from "react"
import { Card, Table } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"

class ExportId extends React.Component {
    constructor(props) {
        super(props)
        
        this.store = props.store
        this.state = {
            id: props.id,
            downloadLink: ""
        }
        this.unsubscribe = () => {}
    }

    componentDidMount() {
        this.store.getState().socket.emit("dashboard-export", this.state.id)
        let waitZipInterval = setInterval(() => fetch("http://localhost:4001/data/" + this.state.id).then(res => {
            if(res.status === 200) {
                this.setState({
                    ...this.state,
                    downloadLink: "http://localhost:4001/data/" + this.state.id
                })
                waitZipInterval = 0;
            }
        }), 2000)
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
                            { this.state.downloadLink.length ? (
                                <a href={ this.state.downloadLink } download>
                                    Télécharger l'archive anonymisée
                                </a>
                            ) : (
                                <span>
                                    Chargement en cours...
                                </span>
                            ) }
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default ExportId