var crypto = require("crypto");

blockChain = new BlockChain();

blockChain.addIntoChain(generateTransaction("syoui", "liaoliao", 20000));

var len = (blockChain.blockChain.length);
//转换为哈希值
function convertIntoHash(str) {
    var sha512 = crypto.createHash('sha512');
    sha512.update(str);
    return sha512.digest('hex');
};


function generateUUID() {
    var material = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var len = material.length;
    var finalStr = "";
    for (var i = 0; i < 32; i++) {
        var index = Math.floor(Math.random() * 33)
        finalStr += material[index];
    }
    return finalStr;
}


//生成一个交易对象
function generateTransaction(sender, receiver, amount) {
    o = new Object();
    o.sender = sender;
    o.receiver = receiver;
    o.amount = amount;
    s = JSON.stringify(o);
    return s;
};


//生成一个区块链
function BlockChain() {

    this.blockChain = [];

    BlockChain.prototype.addIntoChain = function(transaction) {
        preHash = null;
        if (this.blockChain.length > 0) {
            preHash = convertIntoHash(this.blockChain[this.blockChain.length - 1].toString());
        }

        var _proof = this.workProof();
        block = new Block(this.blockChain.length, transaction, preHash, _proof);
        this.blockChain.push(block);
    }

    BlockChain.prototype.getLastBlock = function() {
        if (this.blockChain.length > 0) {
            return this.blockChain[this.blockChain.length - 1];
        } else {
            return null;
        }
    }

    BlockChain.prototype.workProof = function() {
        var proof = 0;
        lastProof = this.getLastBlock() == null ? -1 : this.getLastBlock().proof
        lastBlock = this.getLastBlock()



        if (lastBlock == null) {
            lastHash = null
        } else {
            lastHash = convertIntoHash(lastBlock.toString())
        }

        res = this.validProof(lastProof, proof, lastHash)
        while (!res) {
            proof++;
            res = this.validProof(lastProof, proof, lastHash)
        }

        return proof;
    }

    BlockChain.prototype.validProof = function(lastProof, proof, lastHash) {
        res = convertIntoHash(lastProof + proof + lastHash + "");
        return res.slice(0, 4) == "2623"
    }

    BlockChain.prototype.mine = function() {
        var newTransaction = generateTransaction("0", generateUUID(), 1);
        this.addIntoChain(newTransaction)
    }

};


//生成一个区块
function Block(_index, _transaction, _preHash, _proof) {
    //代表了它在区域链中的哪一个位置
    this.index = 0;
    this.transaction = [];
    this.preHash = null;
    this.timestamp = 0;
    this.proof = 0;

    this.index = _index;
    this.transaction.push(_transaction);
    this.preHash = _preHash;
    this.timestamp = Date.parse(new Date());
    this.proof = _proof;

    Block.prototype.toString = function() {
        return JSON.stringify({ index: this.index, transaction: this.transaction, preHash: this.preHash, proof: this.proof });
    }
};


var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/mine', function(req, res) {
    blockChain.mine();
    res.send(blockChain.getLastBlock());
});

app.get('/chain', function(req, res) {
    res.send(blockChain);
});

app.listen(3000);
