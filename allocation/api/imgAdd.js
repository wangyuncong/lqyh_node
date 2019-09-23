const fs = require('fs')
const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let imgAdd = async (req, res) => {
    try {
        let { userid = '', base_64 = '', name = '' } = req.body
        var nameURl = `${Date.now()}${name || '.png'}`
        var path = `/home/bjyyq/static/${nameURl}`;
        var base64 = base_64.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = Buffer.from(base64, 'base64');
        fs.writeFile(path, dataBuffer, function (err) {//用fs写入文件
            if (err) {
                res.send(err)
            } else {
                res.send({ status: 0, url: nameURl })
            }
        });
    } catch (error) {
        
    }
}
module.exports = imgAdd