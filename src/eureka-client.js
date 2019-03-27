

let axios = require('axios')

let defaultConfig = require('./default-config')

function EurekaClient(ops = {}) {
    if (!(ops && ops.instance)) {
        throw new TypeError('Error：*** Instance configuration does not exist')
    }
    //设置默认参数
    let instance = ops.instance
    if (typeof (instance.port) != 'object') {
        instance.port = {'$': instance.port, '@enabled': 'true'}
    }
    instance.app = instance.app.toLocaleUpperCase()
    instance.instanceId = instance.instanceId || `${instance.ipAddr}:${instance.port['$']}`
    instance.hostName = instance.hostName || instance.ipAddr
    instance.metadata = {'management.port': instance.port['$']}
    instance.homePageUrl = instance.homePageUrl || `http://${instance.ipAddr}:${instance.port['$']}`
    instance.statusPageUrl = instance.statusPageUrl || `${instance.homePageUrl}/actuator/info`
    instance.healthCheckUrl = instance.healthCheckUrl || `${instance.homePageUrl}/actuator/health`
    instance.vipAddress = instance.vipAddress || instance.app
    instance.secureVipAddress = instance.secureVipAddress || instance.app
    instance.lastUpdatedTimestamp = new Date().getTime().toString()
    instance.lastDirtyTimestamp = new Date().getTime().toString()

    //应用配置ops覆盖默认配置
    this.config = defaultConfig
    for (let k in this.config.eureka) {
        if (ops.eureka && ops.eureka[k]) {
            this.config.eureka[k] = ops.eureka[k]
        }
    }
    for (let k in this.config.instance) {
        if (ops.instance && ops.instance[k]) {
            this.config.instance[k] = ops.instance[k]
        }
    }

    let eureka = this.config.eureka
    this.request = []
    for (let i in eureka.serviceUrl) {
        this.request.push(axios.create({
            baseURL: `${eureka.serviceUrl[i]}${eureka.servicePath}`,
            timeout: 3000,
            headers: {'Accept': 'application/json'}
        }))
    }

}

EurekaClient.prototype.call = function (cb) {
    for (let req of this.request) {
        try {
            return cb(req)
        } catch (e) {
            console.error(e.message)
        }
    }
}

/**
 * 注册新实例
 * @param ops
 * @return 响应数据格式参考queryAll.res.json
 */
EurekaClient.prototype.register = function () {
    console.log(this.config.instance)
    return this.call((req) => {
        return req.post(`/${this.config.instance.app}`, {instance: this.config.instance}, {
            validateStatus: function (status) {
                console.log('validateStatus:', status)
                return 204 == status
            }
        }).then((rs) => {
            console.log('register success ...', rs.data)
            return true
        }).catch((err) => {
            console.log(err)
            console.log('register success faile', err.data)
            return false
        })
    })
}

/**
 * 查询所有实例
 * @param ops
 */
EurekaClient.prototype.queryAll = function () {
    return this.call(async (req) => {
        let response = await req.get('')
        EurekaClient.prototype.apps = response.data
        return EurekaClient.prototype.apps
    })
}

/**
 * 查询应用的所有实例
 * @param ops
 */
EurekaClient.prototype.queryByappid = function (app) {
    return this.call(async (req) => {
        let response = await req.get(`/${app}`)
        return response.data
    })
}

/**
 * 发送实例健康检查
 * @param ops
 */
EurekaClient.prototype.heartbeat = function () {
    let app = this.config.instance.app
    let instanceId = this.config.instance.instanceId
    return this.call(async (req) => {
        let response = await req.put(`/${app}/${instanceId}`, {status: 'UP', lastDirtyTimestamp: new Date().getTime()})
        return response.status == 200
    })
}

/**
 * 删除实例
 * @param ops
 */
EurekaClient.prototype.delete = function () {
    let app = this.config.instance.app
    let instanceId = this.config.instance.instanceId
    return this.call(async req => {
        let response = await req.delete(`/${app}/${instanceId}`)
        return response.status
    })
}

const Cron = require('cron')
const CronJob = Cron.CronJob

EurekaClient.prototype.start = async function () {
    let pollIntervalSeconds = this.config.eureka.pollIntervalSeconds
    this.cron = new CronJob(`*/${pollIntervalSeconds} * * * * *`, async function () {
        console.log(`# second${new Date().getTime()}`)
        let eureka = new EurekaClient(EurekaClient.prototype.ops)
        try {
            let rs = await eureka.heartbeat()
            console.log('>> heartbeat success ', rs)
        } catch (e) {
            console.error(e.message)
            try {
                await eureka.register()
            } catch (e1) {
                console.error(e1.message)
            }

        }
    }, null, true, 'Asia/Shanghai')
}

EurekaClient.prototype.stop = function () {
    this.cron.stop()
}

module.exports = EurekaClient
