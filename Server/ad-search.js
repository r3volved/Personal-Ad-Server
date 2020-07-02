const { readFileSync } = require('fs')

module.exports = ( tags ) => {

    tags = typeof tags == 'string' ? tags.split(",") : tags

    let ads  = JSON.parse(readFileSync(`${__dirname}/ads.json`,'utf8'))
    let rad  = {}
    let max  = 0

    ads.forEach(ad => {
        let matches = tags.filter(tag => ad.tags.match(new RegExp(tag,'i'))).length
        //Prioritize equal to first found
        if( matches <= max ) return
        max = matches
        rad = ad
    })

    return Object.assign({},rad)

}