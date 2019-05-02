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
        this.validatedRequests = this.validatedRequests || [];
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getBlockByIndex() {
        this.app.get("/block/:blockHeight", (req, res) => {
            let height = req.params.blockHeight;
            let myBlockChain = new BlockChain.Blockchain();

            return myBlockChain.getBlock(height).then((block) => {
                block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('ascii');
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
            let address = req.body.address;
            if (!address) {
                return res.status(400).send('address required');
            };
            if (!this.validatedRequests.includes(address)) {
                return res.status(400).send('address not validated');
            };
            let star = req.body.star;
            if (!star) {
                return res.status(400).send('star is required');
            };
            if (!star.ra) {
                return res.status(400).send('star right asc required');
            };
            if (!star.dec) {
                return res.status(400).send('star right dec required');
            };
            if (!star.story) {
                return res.status(400).send('star story required');
            };

            star.story = Buffer.from(star.story).toString('hex')
            let myBlockChain = new BlockChain.Blockchain();

            return myBlockChain.addBlock(new BlockClass.Block({ adress: adress, star: star })).then((block) => {
              this.validatedRequests = this.validatedRequests.filter(item => item !== address);
              console.log(this.validatedRequests);

              return res.status(200).send(block);
            })
		});
	}
}

module.exports = (app) => { return new BlockController(app); }
