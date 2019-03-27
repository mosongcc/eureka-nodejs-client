
const Cron = require('cron')
const CronJob = Cron.CronJob

let cron = new CronJob('*/1 * * * * *', function () {
    console.log(`# second${new Date().getTime()}`)
}, null, true, 'Asia/Shanghai')

cron.stop()
