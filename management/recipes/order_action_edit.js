const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid
    let orderid = req.query.orderid
    let actionname = req.query.actionname
    let actiondesc = req.query.actiondesc
    let actionseq = req.query.actionseq
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let sql = `insert into order_action_info(userid, actionname, createtime, updatetime, isdelete, remark1, remark2,actiondesc,remark3,remark4,actionseq,orderid) values ('${userid}', '${actionname}', '${time}', '${time}', '0', NULL, NULL,'${actiondesc}',NULL,NULL,'${actionseq}','${orderid}')`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        
        if(result.serverStatus == 2){
            returnContent.status = 'success'
        }
        res.send(returnContent)
    })
}
module.exports = cateGoryActions