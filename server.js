const moment = require('moment')
const express = require('express');
const app = express();
const utiliz = require('./utilize');
const { doc } = require('./Models/doc')
const { link } = require('./Models/links')
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

utiliz.DB.connect(utiliz.DB.url).then(o => console.log('database is ready')).catch(er => console.log('error connecting to DB: ', er));

app.post('/query', (req, res)=>{
    let startDate = moment.now();
    const optQuery = utiliz.queryOptimization(req.body.query);
    doc.find({$text: {$search: optQuery}}, {score: {$meta: "textScore"},title: 1, url: 1})
        .sort({score : {$meta: "textScore"}}).exec((err, results)=>{
            if(err) return res.send('output was minimum');
            else if(results &&  results.length){
                let out = ''
                let thisHead = utiliz.HTML.head ; 
                thisHead = thisHead.replace('عدد', results.length)
                for(let i = 0 ; i<results.length; i++){
                    let thisCard = utiliz.HTML.card ; 
                    thisCard = thisCard.replace('$link', results[i].url)
                    thisCard = thisCard.replace('$title', results[i].title)
                    thisCard = thisCard.replace('$score', results[i]._doc.score)
                    out += thisCard
                }
                let endDate = moment.now();
                thisHead = thisHead.replace('ساعت', endDate-startDate)
                res.send(thisHead.toString() + out + utiliz.HTML.footer);
            }else res.send('nothing found');
        })
        
    //! when using stream to get the result
    // let cursor = utiliz.getTheResult(optQuery);
    // cursor.on('data', chunk => {
    //     console.log('chunk; ', chunk);
    //     res.write(chunk.toString());
    // }).on('error', er => res.send('some error happend during retrieving result on cursor: ', er))
    //     .on('end', () => res.end());
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Front/Index.html');
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


    // link.aggregate([
    //     {
    //         $group: {
    //             _id: "$url",
    //             count: {$sum: 1},
    //             dups : {$addToSet: "$_id"}
    //         }
    //     },{
    //         $match: {
    //             count: {$gt:1}
    //         }
    //     }
    // ]).exec((err, data)=>{
    //     if(err) console.log('error aggregating links: ', err);
    //     data.forEach((val, index)=>{
    //         console.log(index, ': ', val);
    //         val.dups.pop();
    //         link.deleteMany({_id: {$in : val.dups}},err=>{
    //             if(err) throw new Error('something went wrong deleting duplicate links');
    //         })
    //     })
    // })
})

app.listen(3000, () => console.log('live at 3000'));
// db.documents.aggregate([{$group: {_id : "$url", count: {$sum: 1}}},{$match: {count: {$gt: 1}}}])
// 