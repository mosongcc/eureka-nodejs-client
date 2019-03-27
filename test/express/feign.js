/**
 * 通过服务名获取ip与端口
 * */

let feign = require('eureka-nodejs-client').Feign

/**
 * 应用调用微服务
 * @param biz  参数JSON对象
 */
global.feign = async function(biz ={}){
    let method = biz.method
    let serviceName = method.split('.')[1]

    let ser = await feign(serviceName) //随机返回一个实例
    axios.post(`http://${ser.ipAddr}:${ser.port}`, {biz:JSON.stringify(biz)})

}

module.exports = {}
