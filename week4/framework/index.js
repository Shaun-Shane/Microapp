import babelTransformSync from './transform.js'
import fs from 'fs'
import liveServer from 'live-server'
import { insertScriptToHtml, loadPage, changeMethods } from './utils.js'

try {
    // 编译 pages 中的 jsx
    const jsx = fs.readFileSync('pages/index.jsx', 'utf8')
    console.log('transforming...')
    const trans = babelTransformSync(jsx)
    fs.writeFileSync('framework/dist/pages/index.js', changeMethods(trans.code))
    console.log('success!')

    // insert <script> into html
    insertScriptToHtml()


    // load pages/index
    loadPage('index')

    // start app
    // liveServer.start({
    //     root: 'framework'
    // })
} catch (err) {
    console.log(err)
}

/**
 * 
 * 
 * var params = {
        port: 8181, // Set the server port. Defaults to 8080. 
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
        root: "/public", // Set root directory that's being served. Defaults to cwd. 
        open: false, // When false, it won't load your browser by default. 
        ignore: 'scss,my/templates', // comma-separated string for paths to ignore 
        file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
        mount: [['/components', './node_modules']], // Mount a directory to a route. 
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
        middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
    };
 */