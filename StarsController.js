const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const Block = require("./Block");
const BlockChain = require('./BlockChain.js');
const hex2ascii = require('hex2ascii')

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class StarsController {
	constructor(app) {
		this.app = app;
		this.blockchain = new BlockChain.Blockchain();
		this.searchByHash();
		this.searchByAddress();
    }

    searchByHash(){
		this.app.get("/stars/hash::hash", (req, res) => {
			try {
				let hash = req.params.hash;
				if (!hash) {
					return res.status(500).send('star block hash required');
				};

                return this.blockchain.getBlockHeight().then((height) => {
                	let self = this;
					let starBlocks = [];
					for(var i = 0; i < height; i++) {
						console.log(i);
						self.blockchain.getBlock(i).then((block) => {
							console.log("aki premoh")
							if (block.hash === hash) {
								block.body.star.storyDecoded = hex2ascii(block.body.star.story);

								return res.status(200).send(block);
							}
						})

					}
				});
			} catch (err) {
				return res.status(500).send(err);
			}
		})
	}

	searchByAddress(){
		this.app.get("/stars/address::address", (req, res) => {
			try {
				let address = req.params.address;
				if (!address) {
					return res.status(500).send('star block address required');
				};

				return this.blockchain.getBlockHeight().then((height) => {
                    let self = this;
					let starBlocks = [];
					for(var i = 0; i < height; i++) {
						self.blockchain.getBlock(i).then((block) => {
							if (block.body.address === address){
								block.body.star.storyDecoded = hex2ascii(block.body.star.story);
								return res.status(200).send(block);
							}
						})
					}
				});
			} catch (err) {
				return res.status(500).send(err);
			}
		})
	}
}
module.exports = (app) => { return new StarsController(app); }
