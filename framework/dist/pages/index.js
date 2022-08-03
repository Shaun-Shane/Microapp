import { addFn, invoke } from '../../invoke.js'
import { createElement, useState, Component } from '../../mini-react/mini-react.js';

function App(props) {
  return createElement("h1", null, "Hi ", props.name, "\uFF0C\u8FD9\u662F\u4E00\u4E2A\u51FD\u6570\u7EC4\u4EF6");
}

const arr = ['1', '2', '3'];

function Counter() {
  const [state, setState] = useState(1);
  return createElement("div", null, createElement("button", {
    onClick: () => setState(c => c + 1)
  }, "\u70B9\u51FB + 1, setState, \u5927\u4E8E 3 \u663E\u793A\u7ED3\u679C"), state > 3 ? createElement("p", null, "Count: ", state) : null);
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
        text: 'aaa, click to alert',
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
        style: {
          background: item.color,
          color: this.state.textColor
        },
        onClick: () => alert(item.text)
      }, item.text);
    }));
  }

}

export default class Index extends Component {
  methods = {

async     calc1() {
{ return await invoke(`calc1`, []) }
},


async     calc2(tmp, tmp2) {
{ return await invoke(`calc2`, [tmp, tmp2]) }
}

  };

  render() {
    return createElement("div", {
      className: "myclass"
    }, createElement("span", {
      className: "profile-title",
      onClick: this.methods.calc1
    }, "\u8FD9\u662F\u4E00\u4E2A span, \u70B9\u51FB\u8FDB\u884C 10000000000 \u6B21\u5FAA\u73AF"), createElement("h3", {
      className: "profile-content"
    }, "\u8FD9\u662F\u4E00\u4E2A h3"), "this is ...", createElement(App, {
      name: "foo"
    }), createElement(Counter, null), createElement(List, {
      textColor: 'pink'
    }), arr.map((item, index) => createElement('p', {
      key: index
    }, item)), true ? createElement("p", null, " v-if-true: ", this.methods.calc2(3, 101), " ") : null, false ? createElement("p", null, " v-if-false: ", this.methods.calc2(3, 101)) : null);
  }

}
 addFn(`    calc1() {
      console.log('calc1 running...');
      let tmp = 1;

      for (let i = 0; i < 10000000000; i++) ++tmp;

      console.log('calc1: ', tmp);
      alert('calc1 result' + tmp);
    }`)
 addFn(`    calc2(tmp, tmp2) {
      console.log('calc2 running...');

      for (let i = 0; i < 10000000000; i++) ++tmp;

      tmp += tmp2;
      console.log('calc2:', tmp);
    }`)