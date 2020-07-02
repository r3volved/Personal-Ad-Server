module.exports = ( core ) => {

    const { port, adSearch } = core

    const WebSocket = require('ws')
    
    const wss = new WebSocket.Server({ port })

    const noop = () => {}
    const heartbeat = ( ws ) => ws.isAlive = true
    const ping = () => {
        wss.clients.forEach(ws => {
            if( !ws.isAlive ) 
                return ws.terminate()    
            ws.isAlive = false
            ws.ping(noop)
        })
    }

    const interval = setInterval(ping, 30000);

    wss.on('close', () => clearInterval(interval))
    wss.on('connection', async ws => {
        ws.isAlive = true
        ws.on('close', () => delete ws.swapi)
        ws.on('pong', () => heartbeat( ws ))
        ws.on('message', async message => {
            if( !ws.name ) {
                ws.name = message
                return ws.send("ok")
            }
            try { message = JSON.parse(message) } catch(e) {}
            //Search and reply
            let result = { id:message.id, ad:adSearch(message.data || message) }
            console.log(`Serving ${(result.ad||{}).name || '*No match*'} => ${ws.name}`)
            return ws.send( JSON.stringify( result ) )
        })
    })

    console.log([
        `Ad server listening for Websocket requests on port ${port}`,
        `---------------`,
        ``,
    ].join("\n"))

}