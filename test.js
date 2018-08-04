
const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash =''){
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash= this.calculateHash();
        this.nonce=0;
    }

    calculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("block mined Successfuly\n" + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty=3;
        this.pendingTransactions =[];
        this.miningRewards = 30;
    }

    createGenesisBlock(){
        return new Block(Date.now(), [new Transaction(null,"address1",10000)], "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    createTransactions(transaction){
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardsAddress){
        let newBlock = new Block(Date.now(), this.pendingTransactions);
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);

        this.pendingTransactions =[
            new Transaction(null,miningRewardsAddress,this.miningRewards)
        ];
    }

    getBalanceOfAddress(address){
        let balance=0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address) balance -= trans.amount;
                if(trans.toAddress === address) balance += trans.amount;
            }
        }

        return balance;
    }

    isBlockchainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currenBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currenBlock.hash !== currenBlock.calculateHash()) return false;
            if(currenBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

let testCoin = new Blockchain();

testCoin.createTransactions(new Transaction('address1','address2',60));
testCoin.createTransactions(new Transaction('address2','address1',30));

testCoin.minePendingTransactions("miner1-address");

//console.log(JSON.stringify(testCoin.chain,null,4));
//console.log("is blockchain valid: " + testCoin.isBlockchainValid());
console.log(testCoin.getBalanceOfAddress('address2'));
testCoin.minePendingTransactions("miner1-address");
console.log(testCoin.getBalanceOfAddress('miner1-address'));