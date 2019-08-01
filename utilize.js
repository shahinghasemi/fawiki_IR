const mongoose = require('mongoose');
const { link } = require('./Models/links')
const { doc } = require('./Models/doc')
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
    queryOptimization: (query) => {
        let conjunctions = [
            'و', 'یا', 'پس', 'اگر', 'نه', 'را', 'چون', 'چه', 'از', "با", "؟", "?","!","!",
            'تا', 'اما', 'باری', 'خواه', 'زیرا', 'که', 'لیکن','آیا','چگونه',
            'نیز', 'در', 'ولی', 'هم', 'چون که', 'چونکه', 'چندان که', 'چندانکه', 'زیرا که', 'زیراکه', 'همینکه',
            'همین که', 'همان که', 'بلکه', 'چنانچه', 'چنانکه', 'تا اینکه', 'تا این که', 'تا آنکه', 'تاآنکه', 'آن', 'ان',
            'آنجا', 'آن جا', 'ان', 'ان جا', 'به', 'هرجا', 'اینجا', 'این', 'اینها', 'آنها', 'روی', 'من', 'تو', 'ما', 'شما', 'آنها', 'بر',
        ]
        conjunctions.map((val) => {
            query = query.replace(' ' + val + ' ', ' ');
        })
        return query;
    },
    getTheResult: query => {
        let cursor = doc.find({ $text: { $search: query } }, { score: { $meta: "textScore" }, title: 1, url: 1 })
            .sort({ score: { $meta: "textScore" } }).cursor();
        return cursor;
    },
    HTML: {
        head: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <link rel="stylesheet" href="https://cdn.rtlcss.com/bootstrap/v4.2.1/css/bootstrap.min.css" integrity="sha384-vus3nQHTD+5mpDiZ4rkEPlnkcyTP+49BhJ4wJeJunw06ZAp+wzzeBPUXr42fi8If" crossorigin="anonymous">
        </head>
        
        <body>

            <h1 class="m-2">تعداد سندهای بازیابی شده عدد در ساعت میلی ثانیه</h1>`,

        card: `<div class="card m-5">
        <div class="card-header font-weight-bold">
            <h3>$title</h3>
        </div>
        <div class="card-body">
            <blockquote class="blockquote mb-0">
            <a href="$link">VISIT</a>
            <footer class="blockquote-footer text-danger"> <cite title="Source Title">SCORE: </cite>$score</footer>
            </blockquote>
        </div>
</div>`,
        footer: `</body>
        <script>
        
        
        </script>
        
        </html>`
    }

}