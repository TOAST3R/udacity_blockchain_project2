const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const validationWindow = 300;
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
        this.validatedRequests = [];
        this.requestValidation();
        this.validateRequestByWallet();
    }

    requestValidation(){
        this.app.post("/requestValidation", (req, res) => {
            try {
              let address = req.body.address;

              if (!address) {
                return res.status(500).send('Wallet address is required');
              }

              let requestTimeStamp = this.walletAddressHash[address];
              if (!requestTimeStamp) {
                requestTimeStamp = Math.round(new Date().getTime() / 1000)
              }
              const currentTime =  Math.round(new Date().getTime() / 1000);
              this.walletAddressHash[address] = requestTimeStamp;
              const timeSinceFirstRequest = currentTime - requestTimeStamp;

              return res.json({
                "address": address,
                "requestTimeStamp": requestTimeStamp,
                "message": `${address}:${requestTimeStamp}:starRegistry`,
                "validationWindow": validationWindow - timeSinceFirstRequest
              });
            } catch (err) {
              return res.status(500).send(err);
            }
        });
    }

    validateRequestByWallet(){
        this.app.post("/message-signature/validate", (req, res) => {
            try {
              let address = req.body.address;
              let signature = req.body.signature;

              if (!address || !signature) {
                return res.status(500).send('Wallet address is required');
              }

              const requestTimeStamp = this.walletAddressHash[address];
              if (!requestTimeStamp) {
                return res.status(400).send(`Unable to find address ${address}`);
              }

              //determine if request in validation window
              const currentTime =  Math.round(new Date().getTime() / 1000);
              const timeElapsed = currentTime - requestTimeStamp;
              if (timeElapsed > validationWindow) {
                delete this.walletAddressHash[address];  //remove expired request from hash
                return res.status(400).send(`Request has expired for address ${address}`);
              }

              const message = `${address}:${requestTimeStamp}:starRegistry`;
              const validSignature = bitcoinMessage.verify(message, address, signature);

              if (validSignature) {
                this.validatedRequests.push(address);

                return res.json({
                    "registerStar": true,
                    "status": {
                      "address": address,
                      "requestTimeStamp": requestTimeStamp,
                      "message": message,
                      "validationWindow": validationWindow - timeElapsed,
                      "messageSignature": true
                    }
                });
              } else {
                 console.log("invalid signature");
                 return res.badRequest({err: `Invalid signature`});
              }
            } catch (err) {
              return res.status(500).send(err);
            }
        })
    }

}

let instance;
module.exports = (app) => {
    if(instance){
        console.log("Return already created instance");
        return instance;
    }

    console.log("Creating instance for the first time");
    return new ValidationController(app);
}