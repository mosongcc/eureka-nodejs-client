/**
 * KOA 项目使用 eureka client ,配置服务检查地址路由
 */

let router = require('koa-router')()

router.get('/actuator/info', ctx => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = {}
})

router.get('/actuator/health', ctx => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = {status: 'UP'}
})

module.exports = router
