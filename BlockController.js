const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize all your endpoints here
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        // this.blocks = [];
        // this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
        	let height = req.params.index;
            let myBlockChain = new BlockChain.Blockchain();

            return myBlockChain.getBlock(height).then((block) => {
              return JSON.stringify(block);
			}).then(function(result) {
		        res.status(200).send(result);
		    }).catch(function (e) {
		        res.status(500).send("KO");
		    });
		});
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
            let block = new BlockClass.Block(req.body.data);
            let myBlockChain = new BlockChain.Blockchain();

            return myBlockChain.addBlock(block).then((result) => {
              return result;
            }).then(function(result) {
		        res.status(200).send("OK");
		    }).catch(function (e) {
		        res.status(500).send("KO");
		    });
		});
	}
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
