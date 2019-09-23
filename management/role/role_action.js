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
    let rolename = req.query.rolename
    let roledesc = req.query.roledesc
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(id){
        let sql = `update role_info set rolename='${rolename}', roledesc='${roledesc}', updatetime='${time}' where id=${id}`
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
        let sql = `insert into role_info(rolename, roledesc, createtime, updatetime, isdelete, remark1, remark2) values ('${rolename}', '${roledesc}', '${time}', '${time}', '0', NULL, NULL)`
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
module.exports = cateGoryActions