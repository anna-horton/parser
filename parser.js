const needle = require('needle');
const cheerio = require('cheerio');
const TR = require('transliteration')
const fs = require('fs')


let wordsVideoLinks = []
needle.get('https://www.spreadthesign.com/ru.ru/search/by-category/', function(error, response) {
    if (!error && response.statusCode == 200){

        let $ = cheerio.load(response.body);
        let links = $('.js-searchable a')

        // for (let link of links) {
        for (let i = 0; i < 3; i++) {
            let link = links[i].attribs.href // category link

            needle.get('https://www.spreadthesign.com' + link, function (error, response) {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(response.body);
                    let workLinks = $('.search-results .search-result-title a')

                    for (let j = 0; j < workLinks.length; j++) {
                        let workLink = {
                           href:  workLinks[j].attribs.href, // category link,
                           title: workLinks[j].children[0].data.trim()
                        }
                        workLink.type = cheerio.load(workLinks[j].children.find(el => el.type === 'tag' ? el : false)).text()
                        workLink.name = TR.transliterate(workLink.title)
                        needle.get('https://www.spreadthesign.com' + workLink.href, function (error, response) {
                            if (!error && response.statusCode == 200) {

                            let $ = cheerio.load(response.body);
                            if ($('video') && $('video')[0] && $('video')[0].attribs) {
                                let videoLink = $('video')[0].attribs.src
                                let length = videoLink.split('.').length
                                let ext = videoLink.split('.')[length - 1]
                                let path = `${__dirname}/assets/videos/verbs/${workLink.name}.${ext}`
                                fs.writeFileSync(path, "", "utf8")
                                needle.get(videoLink, {output: path}, (err, resp) => {
                                    console.log(err)
                                    console.log(workLink.name + ' is downloaded')
                                })
                            } else {
                                console.log($('video').html())
                            }
                        } else {
                                console.log(error)

                            }
                        })
                    }

                }
            })
        }
    }

});

