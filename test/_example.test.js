
let eureka = require('../src/index')({
    eureka: {
        serviceUrl: ['http://10.160.1.11:8761'],
        pollIntervalSeconds: 10
    },
    instance:{
        app: 'test-instance',
        ipAddr: '10.21.0.31',
        port: 8761
    }
}, 'info')

eureka.start()
