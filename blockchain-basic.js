
//npm install --save crypto-js 
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,previousHash = ''){
        this.index=index;
        this.previousHash=previousHash;
        this.timestamp=timestamp;
        this.data=data;
        this.hash=this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0,"4/4/2018","Genesis Block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}
//declear the blockchain
let demoCoin = new Blockchain();
demoCoin.addBlock(new Block(1, "10/08/2018",{amount: 4}));
demoCoin.addBlock(new Block(2, "12/08/2018",{amount: 10}));

//print our blockchain
//console.log(JSON.stringify(demoCoin, null, 4));

console.log("is Blockchain valid? " + demoCoin.isChainValid());

demoCoin.chain[1].data={amount: 30};
demoCoin.chain[1].hash=demoCoin.chain[1].calculateHash();

console.log("is Blockchain valid? " + demoCoin.isChainValid());

