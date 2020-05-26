const fetch = require('node-fetch');

module.exports = (url) => {

    fetch(url)
    .then(res => res.text())
    .catch(error => console.error(error))
    .then(body => {
        let html = body;
        console.log(html);
        let pre = html.split(/<pre>/g);
        pre.shift();
        console.log(pre);
    });
}