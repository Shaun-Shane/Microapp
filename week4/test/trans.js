import { render, createElement, useState, Component } from "../mini-react/mini-react.js";

function App(props) {
  return createElement("h1", null, "Hi ", props.name);
}

function Counter() {
  const [state, setState] = useState(1);
  return createElement("div", null, createElement("button", {
    onClick: () => setState(c => c + 1)
  }, "\u70B9\u51FB + 1"), state > 3 ? createElement("p", null, "Count: ", state) : null);
}

class List extends Component {
  render() {
    return createElement("div", {
      className: "border"
    }, createElement("h3", null, this.props.name), "\u6211\u662F\u6587\u672C");
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
}));
const container = document.getElementById("root");
render(profile, container);