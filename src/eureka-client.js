let axios = require('axios')
let defaultConfig = require('./default-config')

function EurekaClient() {
}

EurekaClient.prototype.init = function (ops) {
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
    this.config.eureka = Object.assign(this.config.eureka, ops.eureka)
    this.config.instance = Object.assign(this.config.instance, instance)

    this.logger.info(`Eureka Config : ${JSON.stringify(this.config)}`)
}

/**
 * 配置多个Eureka 服务时，随机获取服务地址
 * @returns {*}
 */
EurekaClient.prototype.axios = function () {
    let serviceUrls = this.config.eureka.serviceUrl
    let i = Math.floor(Math.random() * serviceUrls.length + 1) - 1
    return axios.create({
        baseURL: `${serviceUrls[i]}${this.config.eureka.servicePath}`,
        timeout: this.config.eureka.timeout,
        headers: {'Accept': 'application/json'},
        proxy:this.config.eureka.proxy
    })
}

/**
 * 注册新实例
 * @param ops
 * @return 响应数据格式参考queryAll.res.json
 */
EurekaClient.prototype.register = async function () {
    let app = this.config.instance.app
    let instance = this.config.instance
    let rs = await this.axios().post(`/${app}`, {instance: instance}, {
        validateStatus: function (status) {
            return 204 == status
        }
    }).then((rs) => {
        this.logger.info(`Eureka register success  resStatus=${rs.status} app=${app} instance=${JSON.stringify(instance)} `)
        return true
    }).catch((err) => {
        console.log(err)
        this.logger.error(`Eureka register error ${err.data} `)
        return false
    })
    if(rs){
        //注册状态改为true
        this.regStatus = true
    }
    return rs
}

/**
 * 查询所有实例
 * @param ops
 */
EurekaClient.prototype.queryAll = async function () {
    let response = await this.axios().get('')
    this.logger.debug(`Eureka query all instance ${JSON.stringify(response.data)}`)
    return response.data
}

/**
 * 查询应用的所有实例
 * @param ops
 */
EurekaClient.prototype.queryByappid = async function (app) {
    let response = await this.axios().get(`/${app}`)
    this.logger.debug(`Eureka query app instance ${JSON.stringify(response.data)}`)
    return response.data
}

/**
 * 发送实例健康检查
 * @param ops
 */
EurekaClient.prototype.heartbeat = async function () {
    let app = this.config.instance.app
    let instanceId = this.config.instance.instanceId
    let path = `/${app}/${instanceId}`
    let status = 0
    try {
        let response = await this.axios().put(path, {
            status: 'UP',
            lastDirtyTimestamp: new Date().getTime()
        })
        this.logger.debug(`Eureka app=${app}  ${instanceId} heartbeat ...ok `)
        status = response.status
    } catch (e) {
        console.log(e)
        this.logger.error(`Eureka app=${app}  ${instanceId} heartbeat ...fail put uri=${JSON.stringify(this.config.eureka)} path=${path}  ${e.message}`)
        //注册状态改为false
        eureka.regStatus = false
    }
    return status == 200
}

/**
 * 删除实例
 * @param ops
 */
EurekaClient.prototype.delete = async function () {
    let app = this.config.instance.app
    let instanceId = this.config.instance.instanceId
    let response = await this.axios().delete(`/${app}/${instanceId}`)
    this.logger.debug(`Eureka ${app}  ${instanceId} delete ...ok `)
    return response.status == 200
}

let eureka = new EurekaClient()


module.exports = eureka
