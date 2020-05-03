const fs = require('fs');
const extra = require('fs-extra');
module.exports = {
    Error(file, error, time){
        let filename = `Error-${time}.log`;
        let content = `
                ---ERROR---
        Error has Occur in '${file}'.
        ${error}

        Timestamp: ${new Date(time)}
        `;
        extra.ensureFileSync(`./Log/Errors/${filename}`);
        fs.writeFile(`./Log/Errors/${filename}`, content, {flag: 'w'}, function(error){
            if(error) return console.error(error);
        })
    },

    Info(file, info, time){
        
        let filename = `./Log/Info/Main.log`;
            extra.ensureFileSync(filename);
            let content = `
                         ---Info---
            Info: [${new Date(time)}] {${file}} - ${info}
            `;
            fs.writeFile(filename, content, {flag: 'w'}, function(error){
                if(error) return console.error(error);
            });

    }
}