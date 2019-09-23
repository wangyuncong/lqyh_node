const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cartShopDel = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid
    let goodMsg = JSON.parse(req.query.goodMsg)
    let goodid = ''
    goodMsg.map((item,index)=>{
        if(goodMsg.length <= 1){
            goodid+=`(${item.goodid})`
        }else{
            if(index == 0){
                goodid+=`(${item.goodid}`
            }else if(index == goodMsg.length-1){
                goodid+=`,${item.goodid})`
            }else{
                goodid+=`,${item.goodid}`
            }
        }
    })
    let sql = `update shopping_cart_info set isdelete='${1}' where userid=${userid}`
    // console.log(sql,'00')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result.message) {
            returnContent.status = 'success'
        }
        res.send(returnContent)
    })
}
module.exports = cartShopDel