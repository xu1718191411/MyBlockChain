var crypto = require("crypto");

transaction = [
    (generateTransaction("syoui", "liaoliao", 10000)),
    (generateTransaction("syoui", "gee", 10000)),
    (generateTransaction("syoui", "jesuca", 10000)),
    (generateTransaction("syoui", "xiaoman", 10000)),
]


blockChain = new BlockChain();

blockChain.addIntoChain(new Block(transaction));


console.log(blockChain)

function convertIntoHash(str) {
    var sha512 = crypto.createHash('sha512');
    sha512.update(str);
    return sha512.digest('hex');
}

function generateTransaction(sender, receiver, amount) {
    o = new Object();
    o.sender = sender;
    o.receiver = receiver;
    o.amount = amount;
    s = JSON.stringify(o);
    return s;
}


function BlockChain() {
    this.blockChain = [];

    function BlockChain() {

    }

    this.addIntoChain = function(transaction) {
        block = new Block(this.blockChain.length, transaction);
        this.blockChain.push(block);
    }
};


function Block() {
    this.index = 0;
    this.transaction = []

    function Block(index, transaction) {
        this.index = index;
        this.transaction.push(transaction);
    }

    this.addIntoTransaction = function(transaction) {
        this.transaction.push(transaction);
    }
}