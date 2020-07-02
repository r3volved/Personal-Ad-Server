// test.js
(async function main () {

    //Require client class
    const Client = require(`${__dirname}/Client`)

    //Init a new client with name and host
    const client = new Client({ 
        name : "My ad client",
        host : "http://localhost:4321/",
        maxRetries : 10,
        timeRetries : 5000 //ms
    })

    //Connect client (promise) 
    //Optionally pass a reconnection function override
    await client.connect()

    //Example query (promise)
    let search = ["create","share","learn"]
    let result = await client.get(search)
    let { data } = result
    
    const title = `**${data.name}**`
    const desc  = data.link
        ? `*${data.text.replace(new RegExp(`(${result.name})`,'i'), `[$1](${data.link})`)}*`
        : `*${data.text}*`
    
    console.log( title )
    console.log( desc )

    process.exit()

})()
