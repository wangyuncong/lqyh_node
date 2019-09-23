const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryDelete = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let type = req.query.type || ''
    let sql1 = ''
    if(type == 'yhj'){
        sql1 = `update centshop_good_info set isdelete='${1}' where goodid=${id}`
    }else{
        sql1 = `update centshop_good_info set isdelete='${1}' where id=${id}`
    }
    
    connection.query(sql1, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result.message) {
            returnContent.status = 'success'
        }
        res.send(returnContent)
    })
}
module.exports = cateGoryDelete