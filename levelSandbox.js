/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
      this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
      this.db.get(key);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
      let self = this;
      return new Promise( (resolve, reject) => {
        this.db.put(key, value);
        resolve(self.db.get(key));
      }).catch((err) => { console.log(err); reject(err)});

    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
        });
    }


}

module.exports.LevelSandbox = LevelSandbox;
