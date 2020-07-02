const WebSocket = require('ws')

module.exports = class swapiCli {

    constructor( options = {} ) {
        if( !options.name ) return reject(`Please initialize client with a name`)            
        if( !options.host ) return reject(`Please initialize client with a host`)            
        this.rids = 0
        this.name = options.name
        this.host = options.host
        this.client = null
        this.queue  = new Map()
        this.maxRetries = options.maxRetries || 10
        this.timeRetries = options.timeRetries || 10000
        this.reqid  = () => `${this.name}_${++this.rids}`
    }

    reconenct = ( code ) => setTimeout(() => {
        if( !this.maxRetries ) 
            throw new Error(`Websocket cannot reconnect to ${this.host} right now`)
        this.maxRetries--
        console.log(`Websocket is reconnecting to ${this.host} ...`)
        this.connect(this.reconenct)
    }, this.timeRetries)

    connect( reconenct = this.reconenct ) {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(this.host)
            this.client.on('close', ( code ) => {
                console.error("Websocket connection lost", code)
                this.client = null
                if( typeof reconenct == 'function' )
                    reconenct( code, this )
            })
            this.client.on('error', ( error ) => {
                reject(error)
                console.error(error)
                if( !this.client.connected ) this.client = null
                if( !this.client && typeof reconenct == 'function' )
                    reconenct( code, this )
            })
            this.client.on('open', () => this.client.send(this.name))
            this.client.on('message', message => {

                //If connect success, resolve connect
                if( message == 'ok' ) return resolve(this)
                try { message = JSON.parse(message) } catch(e) {}
                if( message.error ) console.error(message)

                //Dequeue and resolve callback
                let id = (message.id||'').toString()
                let callback = this.queue.get(id)
                if( callback && typeof callback == 'function' ) {
                    callback( message.ad )
                    this.queue.delete(id)
                }
            })
        })
    }

    get( tags ) {
        return new Promise((resolve, reject) => {
            if( !this.client ) 
                return reject(`Please connect to websocket host before querying`)            
            if( !tags ) 
                return reject(`No search tags were specified to query`)

            //Ensure tags are csv string
            tags = Array.isArray(tags) ? tags.join(",") : tags

            //Append to queue map and request from wss
            let id = this.reqid()
            this.queue.set(id.toString(), resolve)
            this.client.send(JSON.stringify({id, data:tags}))
        })
    }   

}