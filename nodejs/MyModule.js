const { dirname, resolve, extname } = require('path')
const fs = require('fs')
const vm = require('vm')

const _dirname = dirname

const _extname = extname

function MyModule (id = '') { // constructor
  this.id = id  // 这个id其实就是我们require的路径
  this.path = _dirname(id) // path是Node.js内置模块，用它来获取传入参数对应的文件夹路径
  this.exports = {}        // 导出的东西放这里，初始化为空对象
  this.filename = null     // 模块对应的文件名
  this.loaded = false      // loaded用来标识当前模块是否已经加载
}

MyModule._cache = Object.create(null)

MyModule._extensions = new Map()

MyModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];

MyModule.prototype.require = function (id) {
  return MyModule._load(id)
}

MyModule._load = function (request) { // request是我们传入的路劲参数
  const filename = MyModule._resolveFilename(request)

  // 先检查缓存，如果缓存存在且已经加载，直接返回缓存
  const cachedModule = MyModule._cache[filename]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }

  // 如果缓存不存在，我们就加载这个模块
  // 加载前先new一个MyModule实例，然后调用实例方法load来加载
  // 加载完成直接返回module.exports
  const module = new MyModule(filename)

  // load之前就将这个模块缓存下来，这样如果有循环引用就会拿到这个缓存，但是这个缓存里面的exports可能还没有或者不完整
  MyModule._cache[filename] = module

  module.load(filename)

  return module.exports
}

MyModule._resolveFilename = function (request) {
  const filename = resolve(request)   // 获取传入参数对应的绝对路径
  const extname = _extname(request)    // 获取文件后缀名

  // 如果没有文件后缀名，尝试添加.js和.json
  if (!extname) {
    const exts = Object.keys(MyModule._extensions)
    for (let i = 0; i < exts.length; i++) {
      const currentPath = `${filename}${exts[i]}`

      // 如果拼接后的文件存在，返回拼接的路径
      if (fs.existsSync(currentPath)) {
          return currentPath
      }
    }
  }

  return filename
}

/*
MyModule.prototype.load是一个实例方法，这个方法就是真正用来加载模块的方法，
这其实也是不同类型文件加载的一个入口，
不同类型的文件会对应MyModule._extensions里面的一个方法：
*/
MyModule.prototype.load = function (filename) {
  // 获取文件后缀名
  const extname = _extname(filename)

  // 调用后缀名对应的处理函数来处理
  MyModule._extensions[extname](this, filename)

  this.loaded = true
}

// 加载js文件: MyModule._extensions['.js']
MyModule._extensions['.js'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8')
  module._compile(content, filename)
}

MyModule._extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module.exports = JSONParse(content);
}

MyModule.wrap = function (script) {
  return MyModule.wrapper[0] + script + MyModule.wrapper[1]
}

MyModule.prototype._compile = function (content, filename) {
  const wrapper = MyModule.wrap(content);    // 获取包装后函数体

  // vm是nodejs的虚拟机沙盒模块，runInThisContext方法可以接受一个字符串并将它转化为一个函数
  // 返回值就是转化后的函数，所以compiledWrapper是一个函数
  const compiledWrapper = vm.runInThisContext(wrapper, {
    filename,
    lineOffset: 0,
    displayErrors: true,
  });

  // 准备exports, require, module, __filename, __dirname这几个参数
  // exports可以直接用module.exports，即this.exports
  // require官方源码中还包装了一层，其实最后调用的还是this.require
  // module不用说，就是this了
  // __filename直接用传进来的filename参数了
  // __dirname需要通过filename获取下
  const dirname = _dirname(filename);

  compiledWrapper.call(this.exports, this.exports, this.require, this,
      filename, dirname);
}

const myModule = new MyModule()

const test = myModule.require('./test.js')
console.log(test.name, test.options)

