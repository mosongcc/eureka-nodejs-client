module.exports = {
    eureka: {
        serviceUrl: ['http://127.0.0.1:8761'],
        servicePath: '/eureka/apps',
        pollIntervalSeconds: 30,  //轮询间隔秒数
    },
    instance: {
        instanceId: '',
        hostName: '',
        app: '',
        ipAddr: '',
        status: 'UP',
        overriddenStatus: 'UNKNOWN',
        port: {
            '$': 39805,
            '@enabled': 'true'
        },
        securePort: {
            '$': 443,
            '@enabled': 'false'
        },
        countryId: 1,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            'name': 'MyOwn'
        },
        leaseInfo: {
            'renewalIntervalInSecs': 10, //更新间隔秒
            'durationInSecs': 30,
            'registrationTimestamp': 0,
            'lastRenewalTimestamp': 0,
            'evictionTimestamp': 0,
            'serviceUpTimestamp': 0
        },
        metadata: {
            'management.port': '8080'
        },
        homePageUrl: '',
        statusPageUrl: '',
        healthCheckUrl: '',
        vipAddress: '',
        secureVipAddress: '',
        isCoordinatingDiscoveryServer: 'false',
        lastUpdatedTimestamp: '',
        lastDirtyTimestamp: ''
    }
}
