const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../session_mysql.js').connection
let pageMessageActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let contentinfo = req.query.contentinfo
    let contenttype1 = req.query.contenttype1
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(id){
        let sql = `update content_info set contentinfo='${contentinfo}', contenttype1='${contenttype1}', updatetime='${time}' where id=${id}`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                returnContent.status = 'success'
            }
            res.send(returnContent)
        })
    }else{
        let sql = `insert into content_info(contentinfo, contenttype1, createtime, updatetime, isdelete, remark1, remark2,contenttype2) values ('${contentinfo}', '${contenttype1}', '${time}', '${time}', '0', NULL, NULL,NULL)`
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
}
module.exports = pageMessageActions