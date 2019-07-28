const mongoose = require('mongoose');
const { link } = require('./Models/links')
const {doc} = require('./Models/doc')
module.exports = {
    DB: {
        url: "mongodb+srv://shahin:shahin@test0-syqxf.mongodb.net/test?retryWrites=true&w=majority",
        connect: (url) => {
            return new Promise((resolve, reject) => {
                mongoose.connect(url, { useNewUrlParser: true })
                    .then(ok => resolve(ok))
                    .catch(err => reject(err));
            })
        },
        query: {
            isTheLinkUnique: (TheLink) => {
                return new Promise((resolve, reject) => {
                    link.findOne({ url: TheLink }, (err, retriedLink) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(retriedLink);
                    })

                })
            }
        }
    },
    queryOptimization: (query)=>{
        let conjunctions = [
            'و', 'یا', 'پس', 'اگر', 'نه', 'را','چون', 'چه',
            'تا', 'اما','باری', 'خواه','زیرا', 'که', 'لیکن',
            'نیز', 'در', 'ولی','هم', 'چون که','چونکه', 'چندان که','چندانکه', 'زیرا که','زیراکه', 'همینکه',
            'همین که', 'همان که','بلکه', 'چنانچه','چنانکه', 'تا اینکه', 'تا این که','تا آنکه', 'تاآنکه','آن', 'ان',
            'آنجا', 'آن جا','ان', 'ان جا','به', 'هرجا', 'اینجا', 'این', 'اینها', 'آنها', 'روی', 'من','تو','ما', 'شما', 'آنها','بر',
        ]
        conjunctions.map((val)=>{
            query = query.replace(' '+val+' ', ' ' );
        })
        return query ;
    },
    getTheResult : query=>{
        let cursor =doc.find({$text: {$search: query}}, {score: {$meta: "textScore"},title: 1, url: 1})
        .sort({score : {$meta: "textScore"}}).cursor();
        return cursor ; 
    }

}