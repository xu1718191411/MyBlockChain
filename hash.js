var crypto = require("crypto");

blockChain = new BlockChain();

//blockChain.addIntoChain(generateTransaction("syoui", "liaoliao", 20000));

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
    this.transaction = []

    BlockChain.prototype.addIntoChain = function(difficulty) {
        preHash = null;
        if (this.blockChain.length > 0) {
            preHash = convertIntoHash(this.blockChain[this.blockChain.length - 1].toString());
        }

        var _proof = this.workProof(difficulty);

        block = new Block(this.blockChain.length, this.transaction, preHash, _proof);
        //verify
        this.blockChain.push(block);
    }

    BlockChain.prototype.getLastBlock = function() {
        if (this.blockChain.length > 0) {
            return this.blockChain[this.blockChain.length - 1];
        } else {
            return null;
        }
    }

    BlockChain.prototype.workProof = function(difficulty) {
        var proof = 0;
        lastProof = this.getLastBlock() == undefined ? "000000" : this.getLastBlock().proof
        lastBlock = this.getLastBlock()

        if (lastBlock == undefined) {
            lastHash = 0
        } else {
            lastHash = convertIntoHash(lastBlock.toString())
        }

        res = this.validProof(lastProof, proof, lastHash,difficulty)
        while (!res) {
            proof++;
            res = this.validProof(lastProof, proof, lastHash,difficulty)
        }

        if(this.getLastBlock() != undefined && lastProof != (this.getLastBlock().proof)){
                console.log("已经有人比你提前算好了")
        }else{
                console.log("你是第一个算好的人,恭喜你挖矿成功")
        }

        console.log("求得工作证明")
        console.log(proof)
        return proof;
    }

    BlockChain.prototype.validProof = function(lastProof, proof, lastHash,difficulty) {
        res = convertIntoHash(lastProof + proof + lastHash + "");
        switch(difficulty){
            case 1:
            return res.slice(0, 2) == "26"
            break;
            case 2:
            return res.slice(0, 3) == "262"
            break;
            case 3:
            return res.slice(0, 4) == "2623"
            break;
            case 4:
            return res.slice(0, 5) == "26231"
            break;
            case 5:
            return res.slice(0, 6) == "262312"
            break;
        }
        
    }

    BlockChain.prototype.mine = function(difficulty,cb) {
        if(this.transaction == undefined || this.transaction.length == 0){
            cb(null,"没有多余的交易了")
        }else{
            var newTransaction = generateTransaction("0", generateUUID(), 1);
            this.transaction.push(newTransaction)
            this.addIntoChain(difficulty)
            cb("恭喜你挖矿成功",null)
            this.transaction = []
        }  
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
var bodyParser = require('body-parser')

var fs = require('fs'); // this engine requires the fs module
app.engine('html', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('#title#', ''+ options.title +'')
    .replace('#message#', ''+ options.message +'');
    return callback(null, rendered);
  });
});
app.set('views', './views'); // specify the views directory
app.set('view engine', 'html'); // register the template engine
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get('/', function(req, res) {
    res.send("Hello World");
});

app.get("/newTransacation",function(req,res){
    res.render('newTransacation', { title: 'Hey', message: 'Hello there!'});
})

app.post("/registeTransacation",function(req,res){
    if(req.body != undefined){
        var newTransacation = generateTransaction(req.body.sender,req.body.receiver,req.body.amount);
        blockChain.transaction.push(newTransacation)
    }
    res.redirect("/allTransacation")
})

app.get("/allTransacation",function(req,res){
    res.send(blockChain.transaction);
})

app.get('/mine', function(req, res) {
    res.render('mine', { title: 'Hey', message: 'Hello there!'});
});

app.post("/mine",function(req,res){
    var difficulty = parseInt(req.body.difficulty);
    console.log(difficulty)

    blockChain.mine(difficulty,function(result,err){
        if(err){
            res.send(err)
        }else{
            res.send(blockChain.getLastBlock());
        }
    });
})

app.get('/chain', function(req, res) {
    res.send(blockChain);
});

app.listen(3001);
