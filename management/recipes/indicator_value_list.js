const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let indicatorid = req.query.indicatorid
    let userid = req.query.userid
    let sql = `select * from medical_indicator_value where isdelete='0' and indicatorid='${indicatorid}' and userid='${userid}'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        returnContent.status = 'success'
        returnContent.data = result
        res.send(returnContent)
    })
}
module.exports = cateGoryList