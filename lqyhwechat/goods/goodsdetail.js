const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let goodsDetail = (req, res) => {
    let returnContent = {
        status:'error',
        data:null
    }
    let goodsId = req.query.goodsId
    let sql = `select * from food_info where isdelete='0' and id=${goodsId}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        returnContent.status = 'success'
        returnContent.data = result
        res.send(returnContent)
    })
    
}
module.exports = goodsDetail