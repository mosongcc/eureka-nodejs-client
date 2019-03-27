let express = require('express')
let app = express()
let morgan = require('morgan')
app.use(morgan('short'))
app.disable('x-powered-by')
app.use(express.static('public'))
app.use(require('body-parser').urlencoded({extended: false}))
app.listen('10509', function () {
    console.log('Start Server http://localhost:10509/')
})

//添加依赖

// 启动eureka服务

//获取服务实例

