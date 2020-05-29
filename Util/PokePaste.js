var TinyURL = require('tinyurl');
module.exports = class PokePaste {
  constructor(){

  }

  import = async (data) => {

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