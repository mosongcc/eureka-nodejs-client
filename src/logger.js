module.exports = function (level = 'debug') {
    let logger = {
        debug(msg){
            'debug info wran error'.indexOf(level)==-1 || console.log(`debug>>  ${msg}`)
        },
        info(msg){
            'info wran error'.indexOf(level)==-1 || console.info(`info>>  ${msg}`)
        },
        warn(msg){
            'wran error'.indexOf(level)==-1  || console.info(`wran>>  ${msg}`)
        },
        error(msg){
            'error'.indexOf(level)==-1  || console.error(`error>>  ${msg}`)
        }
    }
    return logger
}
