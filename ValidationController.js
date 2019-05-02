
//helper libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class ValidationController {

    /**
     * Constructor to create a new BlockController, you need to initialize all your endpoints here
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.walletAddressHash = {};
        this.requestValidation();
    }

    requestValidation(){
        this.app.post("/requestValidation", (req, res) => {
            try {
              let address = req.body.address;

              if (!address) {
                return res.status(500).send('Wallet address is required');
              }

              //calculate validationWindow
              const validationWindow = 300;
              let requestTimeStamp = this.walletAddressHash[address];
              if (!requestTimeStamp) {
                requestTimeStamp = Math.round(new Date().getTime() / 1000)
              }
              const currentTime =  Math.round(new Date().getTime() / 1000);
              this.walletAddressHash[address] = requestTimeStamp;
              const timeSinceFirstRequest = currentTime - requestTimeStamp;

              //set up return message
              let message = `${address}:${requestTimeStamp}:starRegistry`;
              const timeRemaining = validationWindow - timeSinceFirstRequest;

              return res.json({
                "address": address,
                "requestTimeStamp": requestTimeStamp,
                "message": message,
                "validationWindow": timeRemaining
              });
            } catch (err) {
              res.status(500).send(err);
            }
        });
    }

}

module.exports = (app) => { return new ValidationController(app); }
