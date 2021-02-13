const moment = require('moment')
const express = require('express');
const app = express();
const utiliz = require('./utilize');
const { doc } = require('./Models/doc')
const { link } = require('./Models/links')
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 4000

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('./src/dist'))
app.use(cors())

utiliz.DB.connect(utiliz.DB.url).then(o => console.log('database is ready')).catch(er => console.log('error connecting to DB: ', er));

app.post('/query', (req, res)=>{
    let startDate = moment.now();
    const optQuery = utiliz.queryOptimization(req.body.query);
    doc.find({$text: {$search: optQuery}}, {score: {$meta: "textScore"},title: 1, url: 1})
        .sort({score : {$meta: "textScore"}}).exec((err, results)=>{
            if(err) {
                console.log('err: ', err);
                res.status(500).send(err)
            }
            else if(results &&  results.length){
                let took = moment().diff(startDate);
                let out = {
                    results,
                    took 
                }
                res.send(out)
            }
            else res.status(404).send('nothing found');
        })
        
    //! when using stream to get the result
    // let cursor = utiliz.getTheResult(optQuery);
    // cursor.on('data', chunk => {
    //     console.log('chunk; ', chunk);
    //     res.write(chunk.toString());
    // }).on('error', er => res.send('some error happend during retrieving result on cursor: ', er))
    //     .on('end', () => res.end());
})
app.get('*', (req, res) => {
    const htmlPath = path.resolve(__dirname, 'src/dist/index.html');
    res.sendFile(htmlPath);
})


app.get('/aggregate', (req, res) => {

    let agg = doc.aggregate([
        {
            $group: {
                _id: "$title",
                sum: { $sum: 1 },
                dups : {$addToSet: "$_id"}
            }
        },
        {
            $match: {
                sum: { $gt: 1 }
            }
        }
    ]).exec((er, data) => {
        if (er) console.log('error aggregation: ', er);
        data.forEach((val, index) => {
            console.log(index, ': ', val);
            val.dups.pop();
            doc.remove({_id: {$in: val.dups}},err=>{
                if(err) throw Error('something went wrong deleting duplicates');
            })
        })
    })
})

app.listen(PORT, () => console.log(`live at ${PORT}`));
// db.documents.aggregate([{$group: {_id : "$url", count: {$sum: 1}}},{$match: {count: {$gt: 1}}}])
// 