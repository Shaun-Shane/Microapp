import { render, createElement, useState, Component } from "../mini-react/mini-react.js"

function App (props) {
    return <h1>Hi {props.name}</h1>
}

const arr = ['1', '2', '3']

function Counter () {
    const [state, setState] = useState(1)
    return (
        <div>
            <button onClick={() => setState(c => c + 1)}>
                点击 + 1
            </button>
            <p r-if={state > 3}>
                Count: {state}
            </p>
        </div>
    )
}

class List extends Component {
    render() {
        return (
          <div className="border">
            <h3>{this.props.name}</h3>
            我是文本
          </div>
        );
    }
}

const profile = (
    <div className="profile">
        <span className="profile-title">title</span>
        <h3 className="profile-content">content</h3>
        this is ...
        <App name="foo"/>
        <Counter />
        <List textColor={'pink'}/>
        <p r-for={(item, index) in arr} key={index}>
            {item}
        </p>
    </div>
)

const container = document.getElementById("root")
render(profile, container)