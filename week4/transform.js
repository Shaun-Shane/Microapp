import babel from '@babel/core';
import fs from 'fs'

try {
    const code= fs.readFileSync('test/index.js', 'utf8')
    console.log('transforming...')
    const output = babel.transformSync(code, {
        "presets": [
            [
              "@babel/preset-react",
              {
                // 这样写，babel会调用 createElement函数 来递归生成 jsx对象
                "pragma": "createElement"
              }
            ]
        ],
        plugins: [
            function CustomPlugin({types: t}) {
                return {
                    visitor: {
                        JSXElement: function (path) { // JSXElement => jsx中的组件元素
                            let { node } = path; // path.node 可获取到该节点的AST
                            // 遍历 JSXElement 上所有的属性并找出带r-if的
                            let ifAttr = node.openingElement.attributes
                                .find(({ type, name }) => type === 'JSXAttribute' && name.name === 'r-if');
                            if (ifAttr == null) { // 如果ifAttr为undefined则表示该组件没有r-if，则停止访问
                                return;
                            }
                            // 如果ifAttr不为undefined则表示该组件有r-if。下一步是创建新的组件替换之
    
                            // t.JSXOpeningElement表示创建一个组件（或者html标签）的起始部位，参数分别为：标签的类型，属性
                            // 这里我创建了一个组件的起始部位，再将原有的属性赋给新的组件
                            let jsxOpeningElement = t.JSXOpeningElement(
                                node.openingElement.name,
                                node.openingElement.attributes
                                    ? node.openingElement.attributes.filter((attr) => attr !== ifAttr)
                                    : null
                            );
                            // t.JSXElement 表示创建一个react组件（或者html标签），参数分别为：开始标签，结束标签，子集
                            // 创建新的react组件，并讲上一步创建好的起始部位拿过来
                            let jsxElement = t.JSXElement(
                                jsxOpeningElement,
                                node.closingElement,
                                node.children
                            );
                            // t.conditionalExpression 创建一个三元表达式 ，参数分别为：条件，为真时执行，为假时执行
                            // 等于：expression = r-if === true? <div></div> : null
                            let expression = t.conditionalExpression(
                                ifAttr.value.expression, // r-if=“true” 
                                jsxElement, // 创建好的react组件
                                t.nullLiteral() // 这个方法会返回一个 null
                            );
                            //  replaceWith 方法为替换方法
                            path.replaceWith(expression);
                        }
                    }
                }
            }
        ]
    })
    fs.writeFileSync('test/trans.js', output.code)
    console.log('success!')
} catch (err) {
    console.log(err)
}