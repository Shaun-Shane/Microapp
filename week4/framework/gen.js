import { render } from './mini-react/mini-react.js'
import Index from './dist/index.js'

const container = document.getElementById('root')
render(new Index().render(), container)