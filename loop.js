const { doc } = require('./Models/doc');
const { link } = require('./Models/links');
const { DB } = require('./utilize')
const { crwalFunction } = require('./crawl')
const { baseURL } = require('./parsing')
DB.connect(DB.url).catch(err => console.log('error connecting to DB'));
let counter = 0;

let cursor = link.find({ visited: false }).cursor()

cursor.on('data', (chunk) => {
    console.log('link retrieved from DB: ', counter++, ': ', chunk);
    setInterval( ()=>   crwalFunction(baseURL + chunk.url),2000)
})
cursor.on('error', (err) => {
    console.log('error getting the chunks')
})
cursor.on('end', () => console.log('akheeeeysh'));

