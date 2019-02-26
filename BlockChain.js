/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
    }

    // Get block height, it is a helper method that return the height of the blockchain
    // in a promise
    getBlockHeight() {
        let self = this;
        return new Promise(function(resolve, reject){
            self.getChain().then((blocks) => {
                console.log(blocks.length);
                resolve(blocks.length);
            }).catch((err) => { console.log(err); reject(err)});
        })
    }

    // get Chain, it returns all the blocks of the chain in a promise
    getChain(){
        let self = this;
        return new Promise(function(resolve, reject){
            self.bd.getBlocks().then((blocks) => {
                //console.log(blocks);
                resolve(blocks);
            }).catch((err) => { console.log(err); reject(err)});
        })
    }

    // Add new block
    addBlock(newBlock){
        let self = this;
        return new Promise((resolve, reject) => {
            this.getBlockHeight().then((height) => {
                newBlock.height = height;
                newBlock.time = new Date().getTime().toString().slice(0,-3);
                if(height > 0){
                    self.getBlock(height-1).then((block) => {
                        //let blockAux = JSON.parse(block);
                        newBlock.previousBlockHash = block.hash;
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        resolve(self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()));
                    });

                } else {
                    newBlock.body = "First block in the chain - Genesis block";
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                };
                resolve(self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()));
            })
        })

    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.db.get(height, function(err, value) {
                if (err) { console.log("Block " + height + " is not on the chain"); reject(err); }
                console.log("Get block return:", value);
                resolve(JSON.parse(value));
            });
        })
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(blockHeight){
        let valid = this.getBlock(blockHeight).then((block) => {
            //let blockAux = JSON.parse(block);
            let blockHash = block.hash;
            block.hash = '';
            let validBlockHash = SHA256(JSON.stringify(block)).toString();

            if (validBlockHash === blockHash) {
              console.log('Block #'+blockHeight+' Valid Hash:\n'+blockHash+'==='+validBlockHash);
              return true;
            } else {
              console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
              return false;
            }
        }).catch((err) => { console.log(err); reject(err)});
        return new Promise((resolve, reject) => {
            resolve(valid);
        });
    }


    // Validate Blockchain
    validateChain() {
        let errorLog = [];
        // this.getChain().then((block) => {

        // })
        for (var i = 0; i < this.chain.length-1; i++) {
            let validate = this.validateBlock(i).then((valid) => {
                return valid;
            });
            if(!validate){
                errorLog.push(i);
            }
            let blockHash = this.chain[i].hash;
            let previousHash = this.chain[i+1].previousBlockHash;
            if (blockHash!==previousHash) {
              errorLog.push(i);
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
        } else {
            console.log('No errors detected');
        }
        return new Promise((resolve, reject) => {
            resolve(errorLog);
        });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

}

module.exports.Blockchain = Blockchain;
