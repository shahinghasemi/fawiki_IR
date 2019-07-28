
const axios = require('axios')
const { doc } = require('./Models/doc');
const { link } = require('./Models/links')
const { DB, HTML } = require('./utilize');
const Parsing = require('./parsing')
const utilize = require('./utilize')
DB.connect(DB.url).then(ok => console.log('database is ready')).catch('database is not ready');

async function firstCrawl(url) {
    let Doc = {
        url: url,
        title: String,
        headers2: [String],
        headers3: [String],
        contents: [String],
        links: [String],
    }

    Parsing.crawl.gather(url).then(crawledDoc => {
        doc.find({ title: crawledDoc.title }, (err, result) => {
            if (err) console.log("error finding wheather crawledDoc is duplicate or no: ", err);
            if (!result.length) {
                doc.create(crawledDoc)
                    .then(savedDoc => {
                        console.log('saved doc: ', savedDoc);
                        link.find({url : savedDoc.url}, (err, result)=>{
                            if(err) console.log('error finding duplicate links in LINK Collection: ', err);
                            if(!result.length){
                                link.create({url: savedDoc.url, visited: true}).catch(err=>console.log('error saving link to DB: ', err));
                            }
                        })                
                    })
                    .catch(error => console.log('error saving gathered to DB: ', error));
            }
        })

    }).catch(err => console.log('there is something wrong in parsing: ', err));

};

module.exports.crwalFunction = firstCrawl;

