

let eureka = require('./eureka.config')

eureka.instance('TEST-INSTANCE').then((rs)=>{
    console.log(rs)
}).catch(err=>{
    console.error(err.response)
    console.error(err.message)
    console.info(err.status, '   ', err.data)
})
