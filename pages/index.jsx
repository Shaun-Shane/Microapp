import { createElement, useState, Component } from '../../mini-react/mini-react.js'

function App (props) {
    return <h1>Hi {props.name}，这是一个函数组件</h1>
}

const arr = ['1', '2', '3']

function Counter () {
    const [state, setState] = useState(1)
    return (
        <div>
            <button onClick={() => setState(c => c + 1)}>
                点击 + 1, setState, 大于 3 显示结果
            </button>
            <p r-if={state > 3}>
                Count: {state}
            </p>
        </div>
    )
}

function Item (props) {
    return <li className="item" style={props.style} onClick={props.onClick}>{props.children}</li>;
}

class List extends Component {
    constructor (props) {
        super ();
        this.state = {
            list: [
                {
                    text: 'aaa, click to alert',
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
    methods    = {
        calc1 () {
            console.log('calc1 running...')
            let tmp = 1;
            for (let i = 0; i < 10000000000; i++) ++tmp;
            console.log('calc1: ', tmp);
            alert('calc1 result' + tmp)
        },
        calc2 (tmp, tmp2) {
            console.log('calc2 running...')
            for (let i = 0; i < 10000000000; i++) ++tmp
            tmp += tmp2
            console.log('calc2:', tmp)
        }
    }

    render () {
        return (
            <div className="myclass">
                <span className="profile-title" onClick={this.methods.calc1}>这是一个 span, 点击进行 10000000000 次循环</span>
                <h3 className="profile-content">这是一个 h3</h3>
                this is ...
                <App name="foo"/>
                <Counter />
                <List textColor={'pink'}/>
                <p r-for={(item, index) in arr} key={index}>
                    {item}
                </p>
                <p r-if={true}> v-if-true: {this.methods.calc2(3, 101)} </p>
                <p r-if={false}> v-if-false: {this.methods.calc2(3, 101)}</p>
            </div>
        )
    }
}