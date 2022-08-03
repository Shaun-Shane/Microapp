import { render } from '../mini-react/mini-react.js'
import Index from './pages/index.js'

const container = document.getElementById('root')
const view = new Index()
render(view.render(), container)
