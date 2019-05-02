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
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getBlockByIndex() {
        this.app.get("/block/:blockHeight", (req, res) => {
            let height = req.params.blockHeight;
            let myBlockChain = new BlockChain.Blockchain();

            return myBlockChain.getBlock(height).then((block) => {
              return block;
			}).then(function(result) {
		        res.status(200).send(result);
		    }).catch(function (e) {
		        res.status(500).send("KO");
		    });
		});
    }

    postNewBlock() {
        this.app.post("/block", (req, res) => {
            let block = new BlockClass.Block(req.body.body);
            if (block !== null) {
                let myBlockChain = new BlockChain.Blockchain();

	            return myBlockChain.addBlock(block).then((result) => {
	              return result;
	            }).then(function(result) {
			        res.status(200).send(result);
			    }).catch(function (e) {
			        res.status(500).send(e);
			    });
            } else {
            	res.status(500).send("Body is empty");
            }

		});
	}
}

module.exports = (app) => { return new BlockController(app); }
