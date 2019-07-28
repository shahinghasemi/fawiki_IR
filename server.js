const express = require('express');
const app = express();
const utiliz = require('./utilize');
const { doc } = require('./Models/doc')
const { link } = require('./Models/links')
app.use(express.urlencoded({ extended: true }))

utiliz.DB.connect(utiliz.DB.url).then(o => console.log('database is ready')).catch(er => console.log('error connecting to DB: ', er));

doc.find({title: "دیوار آsتش"},(err,result)=>{
    if(result.length) console.log('resulst: ', result)
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Front/Index.html');
})

app.post('/result', (req, res) => {
    const optQuery = utiliz.queryOptimization(req.body.query);
    let cursor = utiliz.getTheResult(optQuery);
    cursor.on('data', chunk => {
        res.write(chunk.toString());
    }).on('error', er => res.send('some error happend during retrieving result on cursor: ', er))
        .on('end', () => console.log('end'));
})


app.get('/aggregate', (req, res) => {

    // let agg = doc.aggregate([
    //     {
    //         $group: {
    //             _id: "$url",
    //             sum: { $sum: 1 },
    //             dups : {$addToSet: "$_id"}
    //         }
    //     },
    //     {
    //         $match: {
    //             sum: { $gt: 1 }
    //         }
    //     }
    // ]).exec((er, data) => {
    //     if (er) console.log('error aggregation: ', er);
    //     data.forEach((val, index) => {
    //         console.log(index, ': ', val);
    //         val.dups.pop();
    //         doc.remove({_id: {$in: val.dups}},err=>{
    //             if(err) throw Error('something went wrong deleting duplicates');
    //         })
    //     })
    // })


    link.aggregate([
        {
            $group: {
                _id: "$url",
                count: {$sum: 1},
                dups : {$addToSet: "$_id"}
            }
        },{
            $match: {
                count: {$gt:1}
            }
        }
    ]).exec((err, data)=>{
        if(err) console.log('error aggregating links: ', err);
        data.forEach((val, index)=>{
            console.log(index, ': ', val);
            val.dups.pop();
            link.deleteMany({_id: {$in : val.dups}},err=>{
                if(err) throw new Error('something went wrong deleting duplicate links');
            })
        })
    })
})


app.listen(3000, () => console.log('live at 3000'));
// db.documents.aggregate([{$group: {_id : "$url", count: {$sum: 1}}},{$match: {count: {$gt: 1}}}])
// 