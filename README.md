# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
let myBlockChain = new BlockChain.Blockchain();
```
5: Generate 10 blocks using a for loop
```
(function theLoop (i) {
  setTimeout(function () {
    let blockTest = new Block.Block("Test Block - " + (i + 1));
    myBlockChain.addBlock(blockTest).then((result) => {
      i++;
      if (i < 10) theLoop(i);
    });
  }, 1000);
})(0);
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Get height of the block chain
```
myBlockChain.getBlockHeight().then((height) => {
  console.log(height);
}).catch((err) => { console.log(err);});
```
8: Get a block
```
GET http://localhost:8000/block/{blockHeight}
```
9: Post a block
```
POST http://localhost:8000/block
with: { body: "data" }
```

**Project 4**

1: Blockchain ID validation routine

This signature proves the users blockchain identity. Upon validation of this identity, the user should be granted access to register a single star.

Use the URL for the endpoint: http://localhost:8000/requestValidation
The request should contain:

`{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }`

Curl example

```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{ "address": "897BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"}'
```

Example response
```
{
  "address": "142BDCeSGbXjWKaAnYXbNpZ6sbrSAo3DpZ",
  "requestTimeStamp": "1531196090",
  "message": "142BDCeSGbXjWKaAnAAbMpZ6sbrSAo3DpZ:1532296090:star Registry",
  "validationWindow": 300
}
```

Use the URL for the endpoint: http://localhost:8000/message-signature/validate
The request should contain:
```
{
"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
 "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}
```
Verify that the time window of 5 minutes didn't expired.

The endpoint response should look like:
```
{
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544454641",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
    }
}
```

Upon validation, the user is granted access to register a single star.


2: Star registration Endpoint

Configure the star registration endpoint. This will allow your application to accept users requests. In this section, we'll provide resources on how to do this effectively.

*Example: Block with star object endpoint*

```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```

*Response*
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "11h 20m 1.0s",
      "dec": "-16° 25' 24.1",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532096234",
  "previousBlockHash": "19cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

3: Star Lookup

Use the URL: http://localhost:8000/stars/hash:[HASH]

The response includes entire star block contents along with the addition of star story decoded to ASCII.

```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

Use the URL: http://localhost:8000/stars/address:[ADDRESS]

The response includes entire star block contents along with the addition of star story decoded to ASCII.

This endpoint response contained a list of Stars because of one wallet address can be used to register multiple Stars.

Response:
```
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```

Use the URL: http://localhost:8000/block/[HEIGHT]

The response includes entire star block contents along with the addition of star story decoded to ASCII.
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
