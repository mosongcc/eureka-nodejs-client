
let eureka = require('./eureka.config')

eureka.delete().then((rs)=>{
    console.log(rs)
}).catch(err=>{
    console.error(err.response)
    console.error(err.message)
    console.info(err.status, '   ', err.data)
})
