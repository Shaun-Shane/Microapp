import { render, createElement, useState, Component } from "../mini-react/mini-react.js";

function App(props) {
  return createElement("h1", null, "Hi ", props.name);
}

const arr = ['1', '2', '3'];

function Counter() {
  const [state, setState] = useState(1);
  return createElement("div", null, createElement("button", {
    onClick: () => setState(c => c + 1)
  }, "\u70B9\u51FB + 1"), state > 3 ? createElement("p", null, "Count: ", state) : null);
}

function Item(props) {
  return createElement("li", {
    className: "item",
    style: props.style,
    onClick: props.onClick
  }, props.children);
}

class List extends Component {
  constructor(props) {
    super();
    this.state = {
      list: [{
        text: 'aaa',
        color: 'blue'
      }, {
        text: 'bbb',
        color: 'orange'
      }, {
        text: 'ccc',
        color: 'red'
      }],
      textColor: props.textColor
    };
  }

  render() {
    return createElement("ul", {
      className: "list"
    }, this.state.list.map((item, index) => {
      return createElement(Item, {
        backgroundColor: item.color,
        color: this.state.textColor,
        onClick: () => alert(item.text)
      }, item.text);
    }));
  }

}

const profile = createElement("div", {
  className: "profile"
}, createElement("span", {
  className: "profile-title"
}, "title"), createElement("h3", {
  className: "profile-content"
}, "content"), "this is ...", createElement(App, {
  name: "foo"
}), createElement(Counter, null), createElement(List, {
  textColor: 'pink'
}), arr.map((item, index) => createElement('p', {
  key: index
}, item)));
const container = document.getElementById("root");
render(profile, container);