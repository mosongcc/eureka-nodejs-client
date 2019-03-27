
let eureka = require('../src/index')({
    eureka: {
        serviceUrl: ['http://10.160.1.11:8761']
    },
    instance:{
        instanceId:'orgacc',
        'app': 'orgacc',
        'ipAddr': '10.21.0.31',
        'port': 8761
    }
})
module.exports =  eureka
