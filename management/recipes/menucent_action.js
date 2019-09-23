const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let menucent = req.query.menucent || ''
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let sql = `update order_menu_info set menucent='${menucent}' where id=${id}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.message){
            returnContent.status = 'success'
        }
        res.send(returnContent)
    })
}
module.exports = cateGoryActions