(async function main () {

    //Require client class
    const Client = require(`${__dirname}/Client`)

    //Init a new client with name and host
    const client = new Client({ 
        name : "My ad client",
        host : "http://localhost:4321/"
    })

    //Connect client (promise)
    await client.connect()

    //Example allycode query (promise)
    let search = ["create","share","learn"]
    let result = await client.get(search)
    let { data } = result
    
    const title = `**${data.name}**`
    const desc  = data.link
        ? `*${data.text.replace(new RegExp(`(${result.name})`,'i'), `[$1](${data.link})`)}*`
        : `*${data.text}*`
    
    console.log([ title, desc ].join("\n"))

    process.exit()

})()
