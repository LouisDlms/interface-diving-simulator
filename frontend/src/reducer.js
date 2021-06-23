import io from "socket.io-client";

const initialState = {
    ENDPOINT: "http://localhost:4001",
    status: {
        app: 0,
        server: 0,
        bpm: 0,
        breath: 0
    },
    doctor: {
        id: 0,
        firstName: "",
        lastName: ""
    },
    patient: {
        id: 0,
        firstName: "",
        lastName: "",
        birthDay: "",
        sex: "",
        weight: 0,
        height: 0
    },
    socket: io("http://localhost:4001", {
        transports: ['websocket'],
    }),
    simulationStart: 0,
    serverClock: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    sensors: {
        bpm: [],
        breath: []
    },
    phase: 0
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        // Do something here based on the different types of actions
        case 'status/app/error': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: 0,
                    server: state.status.server,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'status/app/sync': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: 1,
                    server: state.status.server,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'status/app/ok': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: 2,
                    server: state.status.server,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'status/server/error': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: state.status.app,
                    server: 0,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'status/server/sync': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: state.status.app,
                    server: 1,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'status/server/ok': {
            // We need to return a new state object
            return {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                status: {
                    app: state.status.app,
                    server: 2,
                    bpm: state.status.bpm,
                    breath: state.status.breath
                }
            }
        }

        case 'doctor/set': {
            return {
                ...state,
                doctor: {
                    id: action.payload.id,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName
                }
            }
        }

        case 'patient/set': {
            return {
                ...state,
                patient: {
                    id: action.payload.id,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    birthDay: action.payload.birthDay,
                    sex: action.payload.sex,
                    weight: action.payload.weight,
                    height: action.payload.height
                }
            }
        }

        case 'serverClock/update': {
            return {
                ...state,
                serverClock: {
                    hours: Math.floor(action.payload / (1000*60*60)),
                    minutes: Math.floor((action.payload / (1000*60)) % 60),
                    seconds: Math.floor((action.payload / 1000) % 60)
                }
            }
        }

        case 'simulationStart/set': {
            return {
                ...state,
                simulationStart: action.payload
            }
        }

        case 'phase/set': {
            return {
                ...state,
                phase: action.payload
            }
        }

        case 'status/bpm/ok': {
            return {
                ...state,
                status: {
                    app: state.status.app,
                    server: state.status.server,
                    bpm: 1,
                    breath: state.status.breath
                }
            }
        }

        case 'bpm/update': {
            return {
                ...state,
                sensors: {
                    bpm: action.payload,
                    breath: state.sensors.breath
                }
            }
        }

        case 'status/breath/ok': {
            return {
                ...state,
                status: {
                    app: state.status.app,
                    server: state.status.server,
                    bpm: state.status.bpm,
                    breath: 1
                }
            }
        }

        case 'breath/update': {
            return {
                ...state,
                sensors: {
                    bpm: state.sensors.bpm,
                    breath: action.payload
                }
            }
        }

        default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
            return state
    }
}