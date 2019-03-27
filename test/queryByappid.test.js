
let eureka = require('./eureka.config')

eureka.queryByappid().then(rs=>{
    console.log('queryByappid rs:', rs)
}).catch(err=>{
    console.error(err)
})
