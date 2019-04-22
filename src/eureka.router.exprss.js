/**
 * Express 项目使用 eureka client ,配置服务检查地址路由
 */
let express = require('express')
let router = express.Router()

router.get('/actuator/info', function (req, res) {
    res.header('Content-Type', 'application/json')
    res.send({})
    res.end()
})

router.get('/actuator/health', function (req, res) {
    res.header('Content-Type', 'application/json')
    res.send({status: 'UP'})
    res.end()
})

module.exports = router
