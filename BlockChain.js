/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        this.chain = [];
        this.addBlock(new Block.Block("First block in the chain - Genesis block"));
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        let self = this;
        return new Promise(function(resolve, reject){
            resolve(self.chain.length-1);
        }).catch((err) => { console.log(err); reject(err)});
    }

    // Add new block
    addBlock(newBlock){
        newBlock.height = this.chain.length;
        // this.getBlockHeight().then((height) => {
        //     newBlock.height = height + 1;
        // });
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        if(this.chain.length>0){
            newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
        }
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        this.chain.push(newBlock);
        let self = this;
        return new Promise(function(resolve, reject){
            resolve(self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString()));
        }).catch((err) => { console.log(err); reject(err)});
    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.db.get(height, function(err, value) {
                if (err) { console.log("Block " + height + " is not on the chain"); reject(err); }
                console.log("Get block return:", value);
                resolve(value);
            });
        })
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(blockHeight){
        let valid = this.getBlock(blockHeight).then((block) => {
            let blockAux = JSON.parse(block);
            let blockHash = blockAux.hash;
            blockAux.hash = '';
            let validBlockHash = SHA256(JSON.stringify(blockAux)).toString();

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
