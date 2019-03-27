
let eureka = require('./eureka.config')

eureka.queryAll().then((rs)=>{
    console.log(JSON.stringify(rs))
})
