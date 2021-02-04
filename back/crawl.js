
const { doc } = require('./Models/doc');
const { link } = require('./Models/links')
const { DB, HTML } = require('./utilize');
const Parsing = require('./parsing')
DB.connect(DB.url).then(ok => console.log('database is ready')).catch('database is not ready');

async function firstCrawl(url) {
    return new Promise((resolve, reject) => {
        Parsing.crawl.gather(url).then(crawledDoc => {
            doc.find({ title: crawledDoc.title },{url:1}, (err, result) => {
                if (err) reject(err);
                else if (!result.length) {
                    doc.create(crawledDoc)
                        .then(savedDoc => {
                            link.find({ url: savedDoc.url }, (err, result) => {
                                if (err) reject(err);
                                else if (!result.length) {
                                    console.log('saved doc: ', savedDoc);
                                    link.create({ url: savedDoc.url, visited: true })
                                        .then(savedURL => resolve(`done: savedURL: ${savedURL}`))
                                        .catch(err => reject(err));
                                }else resolve('duplicate link')
                            })
                        })
                        .catch(error => reject(error));
                }else resolve(`duplicate doc: ${result[0].url}`);
            })
        }).catch(err => reject(err));
    })
};

module.exports.crwalFunction = firstCrawl;

