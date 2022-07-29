import { render, createElement, useState } from "./mini-react/mini-react"

function App(props) {
    return <h1>Hi {props.name}</h1>
}

function Counter() {
    const [state, setState] = useState(1)
    return (
        <div>
            <button onClick={() => setState(c => c + 1)}>
                点击 + 1
            </button>
            <p>Count: {state}</p>
        </div>
    )
}

const profile = (
    <div className="profile">
        <span className="profile-title">title</span>
        <h3 className="profile-content">content</h3>
        this is ...
        <App name="foo"/>
        <Counter />
    </div>
)

const container = document.getElementById("root")
render(profile, container)