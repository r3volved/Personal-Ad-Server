const adSearch = require(`${__dirname}/ad-search.js`)
const adFile = `${__dirname}/ads.josn`
const port = process.env.PORT || 4321
const core = { port, adSearch }
return require('./websocket.js')( core )
