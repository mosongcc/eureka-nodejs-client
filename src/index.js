/**
 * Eureka nodejs client
 * 使用Eureka Rest 实现nodejs 版客户端
 */

let EurekaClient = require('./eureka-client')

module.exports = {
    EurekaClient(ops) {
        EurekaClient.prototype.ops = ops
        return new EurekaClient(ops)
    },
    async Feign(app) {
        let eureka = new EurekaClient(EurekaClient.prototype.ops)
        let apps = await eureka.queryByappid(app)
        let instance = apps.application.instance
        let rn = Math.floor(Math.random() * instance.length + 1) - 1
        return {idAddr: rn.ipAddr, port: rn.port['$']}
    },
    start(){

    },
    stop(){

    }
}
