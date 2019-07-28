const axios = require('axios');
const cheerio = require('cheerio');
const { doc } = require('./Models/doc');
module.exports = {
    baseURL: 'https://fa.wikipedia.org',

    crawl: {

        gather: (url) => {
            return new Promise((resolve, reject) => {
                axios.get(url).then(res => {
                    const $ = cheerio.load(res.data);
                    let obj = {
                        url : url,
                        links: [String],
                        contents: [String],
                        headers2: [String],
                        headers3: [String],
                        title: String,
                    }
                    
                    //** links */
                    $('.mw-parser-output a').map(function (index, el) {
                        let href = $(this).attr('href');
                        if (href && href.startsWith('/wiki/')) obj.links[index] = $(this).attr('href');
                        obj.links = obj.links.filter((val) => val != null);
                        $('.mw-parser-output p').map(function (index, el) {
                            let content = []
                            obj.contents [index] = $(this).text();
                        })
                    })

                    obj.title = $('#firstHeading').text();

                    $('.mw-parser-output h2').map(function (index, el) {
                        let headers = [];
                        obj.headers2[index] = $(this).text();
                    })

                    $('.mw-parser-output h3').map(function (index, el) {
                        let headers = [];
                        obj.headers3[index] = $(this).text();
                    })
                    resolve(obj);
                }).catch(err => {
                    reject(err);
                })
            })
        },

    },
    saveLinksToDB: (links) => {
        return new Promise((resolve, reject) => {
            links.map((el, index) => {
                doc.create({ code: el })
                    .then(ok => resolve(ok))
                    .catch(err => reject(err));
            })
        })
    }
}