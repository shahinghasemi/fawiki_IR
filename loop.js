const { doc } = require('./Models/doc');
const { link } = require('./Models/links');
const { DB } = require('./utilize')
const { crwalFunction } = require('./crawl')
const { baseURL } = require('./parsing')
DB.connect(DB.url).catch(err => console.log('error connecting to DB'));
let counter = 0;

function loopThrough(urls) {
    crwalFunction(baseURL + urls.pop().url)
        .then(something =>{
            console.log('result: ' , something);
            loopThrough(urls);
        })
        .catch(err => console.log('something went wrong: ', err));
}
link.find({ visited: false }, (err, urls) => {

    loopThrough(urls);
    // console.log(urls.length)
}).limit(300); //set limit ot 1000 links or somethin like that




// cursor.on('data', async (chunk) => {
//     console.log('link retrieved from DB: ', counter++, ': ', chunk.url);
//     crwalFunction(baseURL+chunk.url);
// })
// cursor.on('error', (err) => {
//     console.log('error getting the chunks')
// })
// cursor.on('end', () => console.log('akheeeeysh'));

