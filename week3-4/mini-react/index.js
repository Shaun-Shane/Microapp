import {
  Component,
  useReducer,
  useState,
  useEffect,
  useLayoutEffect
} from "./react";
import ReactDOM from "./react-dom";

const createElement = (type, props, ...children) => {
  if (props === null) props = {}
  return {
    type,
    props,
    children
  }
}

export {
  ReactDOM,
  Component,
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
  createElement
};