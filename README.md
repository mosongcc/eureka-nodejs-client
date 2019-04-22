# eureka-nodejs-client

Eureka server version 1.9.8 

Example demo:

> npm install eureka-nodejs-client  --save 

```js

let eureka = require('eureka-nodejs-client')({
    eureka: {
        serviceUrl: ['http://10.160.1.11:8761'],
        pollIntervalSeconds: 10,
        registerWithEureka: false,   //是否注册当前注册
    },
    //最简单实例配置，更多配置参考默认配置文件 
    instance:{
        app: 'test-instance',  //当前服务名
        ipAddr: '10.21.0.31',  //当前服务IPv4
        port: 8761             //当前服务端口
    }
}, 'info')

//服务启动事件执行
eureka.start()

//删除服务,服务停止事件执行
eureka.delete()

//默认简单使用随机方式获取实例IP与端口，应用用来调用服务
eureka.instance('test-instance').then(rs=>{
    console.log(rs)   // { idAddr: '10.21.0.31', port: 8761 }    
})

//健康检查express路由
eureka.eurekaExpressRouter()


//健康检查express路由
eureka.eurekaKoaRouter()


```
