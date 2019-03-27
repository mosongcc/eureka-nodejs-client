
let eureka = require('../src/index')({
    eureka: {
        serviceUrl: ['http://10.160.1.11:8761'],
        pollIntervalSeconds: 3
    },
    instance:{
        app: 'orgacc',
        ipAddr: '10.21.0.31',
        port: 8761
    }
})

eureka.start()
