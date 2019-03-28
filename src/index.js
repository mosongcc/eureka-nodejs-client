/**
 * Eureka nodejs client
 * 使用Eureka Rest 实现nodejs 版客户端
 */
const Cron = require('cron')
const CronJob = Cron.CronJob

let eureka = require('./eureka-client')
let logger = require('./logger')

module.exports = function (config, logLevel='info') {
    eureka.logger = config.logger || logger(logLevel)
    eureka.init(config)
    return {
        /**
         * 启动服务
         */
        start(){
            let pollIntervalSeconds = eureka.config.eureka.pollIntervalSeconds
            eureka.cron = new CronJob(`*/${pollIntervalSeconds} * * * * *`, async function () {
                if(eureka.regStatus){
                    await eureka.heartbeat()
                }else{
                    await eureka.register()
                }
            }, null, true, 'Asia/Shanghai')
            eureka.cron.start()
            return eureka
        },
        /**
         * 停止健康检查
         */
        stop(){
            eureka.cron.stop()
            return eureka
        },
        /**
         * 剔除当前实例，在服务停止事件中调用
         */
        delete(){
            return eureka.delete()
        },
        /**
         * 随机获取服务实例
         * @param name
         * @returns {Promise<{idAddr: (string), port: *}>}
         */
        async instance(name){
            let pollIntervalSeconds = eureka.config.eureka.pollIntervalSeconds
            let fnt = `fetch-${name}-time`
            let fetchTime = eureka[fnt] || 0
            let currentTime = new Date().getTime()

            //获取服务实例列表
            if((!eureka.apps)||(fetchTime+pollIntervalSeconds*1000 < currentTime)){
                eureka.apps = await eureka.queryByappid(name)
                eureka[fnt] = currentTime
            }
            let instance = eureka.apps.application.instance
            let rn = Math.floor(Math.random() * instance.length + 1) - 1
            let ai = instance[rn]
            return {idAddr: ai.ipAddr, port: ai.port['$']}
        },
        /**
         * Express服务健康检查路由
         */
        eurekaExpressRouter(){
            return require('./exprss.eureka.router')
        }
    }
}
