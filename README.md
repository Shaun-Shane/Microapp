实践项目阶段性任务一：
- 介绍小程序产品概念，引入小程序技术抽象。本周主要聚焦于在浏览器下实现小程序的双线程加载模型，了解 web-worker 相关的概念，实现基本的模块加载函数，并完成双线程的通信。
    - [小程序简介](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/start/introduction/)
    - [Web Worker 使用教程 - 阮一峰的网络日志](https://juejin.cn/post/6844903808330366989)
    - [深入Node.js的模块加载机制，手写require函数 - 掘金](https://juejin.cn/post/6844903696258564110)
    - [JavaScript多线程编程 - 掘金](https://juejin.cn/post/6866973719634542606)
    - [Node.js 多线程完全指南 - 掘金](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)
    - [小程序底层实现原理](https://github.com/berwin/Blog/issues/43)
    - [小程序底层实现原理 2](https://github.com/berwin/Blog/issues/49)
- 通过了解小程序的底层实现原理，我们能够了解到小程序实际上是由双线程模型实现的，而通过 web-worker 可以简单搭建出一个双线程模型，使用模块加载函数，我们则能引入已经写好的方法函数，那么你能通过以上文档实现一个基本的模块加载函数，及实现双线程的简单通信吗？
​​​