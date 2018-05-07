var crypto = require("crypto");


blockChain = new BlockChain();

blockChain.addIntoChain(generateTransaction("syoui", "liaoliao", 20000));
blockChain.addIntoChain(generateTransaction("syoui", "gee", 20000));
blockChain.addIntoChain(generateTransaction("syoui", "jesuca", 31000));
blockChain.addIntoChain(generateTransaction("syoui", "xiaoman", 10000));
blockChain.addIntoChain(generateTransaction("syoui", "lily", 5000));
blockChain.addIntoChain(generateTransaction("syoui", "gemo", 400));
blockChain.addIntoChain(generateTransaction("syoui", "ruby", 420));
blockChain.addIntoChain(generateTransaction("syoui", "cisco", 230));


var len = (blockChain.blockChain.length);

for (i = 0; i < len; i++) {
    console.log(blockChain.blockChain[i].toString());
}




//转换为哈希值
function convertIntoHash(str) {
    var sha512 = crypto.createHash('sha512');
    sha512.update(str);
    return sha512.digest('hex');
};


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
        return res.slice(0, 4) == "0001"
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
}