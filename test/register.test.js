
let eureka = require('./eureka.config')

eureka.register().then(rs=>{
    console.log('register rs:', rs)
})
