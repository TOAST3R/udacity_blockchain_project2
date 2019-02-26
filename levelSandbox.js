/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
      this.db = level(chainDB);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
      let self = this;
      return new Promise( (resolve, reject) => {
        resolve(self.db.put(key, value));
      }).catch((err) => { console.log(err); reject(err)});
    }

    // Method that return the height
    getBlocks() {
        let self = this;
        let dataArray = [];
        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                dataArray.push(data);
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(dataArray);
            });
        });
    }


}

module.exports.LevelSandbox = LevelSandbox;
