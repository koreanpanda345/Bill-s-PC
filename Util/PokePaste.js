var TinyURL = require('tinyurl');
const fetch = require('node-fetch');
const htmlToArticleJson = require('@mattersmedia/html-to-article-json')();
module.exports = class PokePaste {
  constructor(){}

  import = async (url) => {
    let data = await new Promise((resolve, reject) => {
      fetch(url)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then(body => {
        console.log(body);
        let html = body;
        const json = htmlToArticleJson(html);
        let team = "";
        for(let i = 0; i < json.length; i++){
          if(json[i].type === "paragraph"){
            let content = json[i].children[0].content;
            content = content.replace(/Ability:+/g, "<>Ability:");
            content = content.replace(/EVs:+/g, "<>EVs:");
            content = content.replace(/IVs:+/g, "<>IVs:");
            content = content.replace(/(- )+/g, "<>-");
            team += content + "\n\n"
          }
        }
        let _data = {
          title: json[json.length - 3].children[0].content,
          team: team.replace(/<>+/g, "\n"),
        }
        return resolve({team_name: _data.title, team_paste: _data.team.replace("Columns Mode / Stat Colours / Light Mode", ""), team_send: "public", success: true});
      })
    })
    return data;
  }
  
  export = async (data) => {
    let url = encodeURI('title=' + data.title + "&paste=" + data.paste + "&author=" + data.author);
    url = url.replace(/:/g, '%3A');
    url = url.replace(/%20/g, '+');
    url = url.replace(/\n/g, '%0A');
    url = url.replace(/%0A/g, '%0D%0A');
    url = 'https://pokepast.es/create?' + url;
    let _data = await new Promise((resolve, reject) => {
      TinyURL.shorten(url, (res, err) =>{
        if(err) return resolve({reason: err, success: false});
        resolve({url: res, success: true});
      })
    })
    return _data;
  }

}