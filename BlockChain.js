/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const BlockClass = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.getBlockHeight().then((height) => {
            if(height == -1){
                this.addBlock(new BlockClass.Block({}));
            }

        })
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
                        newBlock.previousBlockHash = block.hash;
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                        resolve(self.getBlock(newBlock.height));
                    });

                } else {
                    newBlock.body = "First block in the chain - Genesis block";
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                    resolve(self.getBlock(newBlock.height));
                };

            })
        })

    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.db.get(height, function(err, value) {
                if (err) {
                    console.log("Block " + height + " is not on the chain");
                    reject(err); }
                else {
                    //console.log("Get block return:", value);
                    resolve(JSON.parse(value));
                };
            });
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(blockHeight){
        console.log("validateBlock");
        console.log(blockHeight);
        let valid = this.getBlock(blockHeight).then((block) => {
            let blockHash = block.hash;
            block.hash = '';
            let validBlockHash = SHA256(JSON.stringify(block)).toString();

            if (validBlockHash === blockHash) {
              //console.log('Block #'+blockHeight+' Valid Hash:\n'+blockHash+'==='+validBlockHash);
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

    // Validate all blocks in the Blockchain, we validate if the hash is valid
    // recreating it and if the previousHash is valid comparing it with the previous hash
    validateChain() {
        let self = this;
        let promises = [];

        this.getBlockHeight().then((height) => {
            // loop to go for all the blocks of the blockchain
            for (let i = 0; i < height-1; i++) {
                self.getBlock(i).then((block) => {
                    let height = block.height;
                    promises.push(new Promise((resolve, reject) => {
                        // validate the hash of the block
                        self.validateBlock(height).then((valid) => {
                            if(!valid){
                                resolve(i);
                            } else {
                                resolve(null);
                            }
                        });
                    }));
                    if(i>0){
                        promises.push(new Promise((resolve, reject) => {
                            // validate previousHash of the block
                            self.getBlock(i-1).then((previousBlock) => {
                                if(previousBlock.hash !== block.previousBlockHash){
                                    resolve(i);
                                } else {
                                    resolve(null);
                                }
                            });
                        }));
                    }
                });
            }
            Promise.all(promises).then(data => {
                return new Promise( (resolve, reject) => {
                    console.log("jefe finallll");
                    if (data.length>0) {
                        console.log('Block errors = ' + errorLog.length);
                        resolve('Blocks: '+errorLog);
                    } else {
                        console.log('No errors detected');
                        resolve('No errors detected');
                    }

                });
            });
        })
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
