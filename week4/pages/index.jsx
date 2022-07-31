import { createElement, useState, Component } from '../mini-react/mini-react.js'

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

function Item(props) {
    return <li className="item" style={props.style} onClick={props.onClick}>{props.children}</li>;
}

class List extends Component {
    constructor (props) {
        super ();
        this.state = {
            list: [
                {
                    text: 'aaa',
                    color: 'blue'
                },
                {
                    text: 'bbb',
                    color: 'orange'
                },
                {
                    text: 'ccc',
                    color: 'red'
                }
            ],
            textColor: props.textColor
        }
    }

    render () {
        return <ul className="list">
            {this.state.list.map((item, index) => {
                return <Item
                        style={{ background: item.color, color: this.state.textColor}}
                        onClick={() => alert(item.text)}>
                            {item.text}
                        </Item>
            })}
        </ul>;
    }
}

export default class Index extends Component {
    render () {
        return (
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
    }
}