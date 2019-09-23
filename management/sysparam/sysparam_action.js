const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let medicalLndicatorActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {id,paramname,paramvalue,paramdesc} = req.query
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(id){
        let sql = `update sysparam set paramname='${paramname}', paramvalue='${paramvalue}',paramdesc='${paramdesc}' where id=${id}`
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
        let sql = `insert into sysparam(paramname, paramvalue, createtime, updatetime, isdelete, remark1, remark2,paramdesc) values ('${paramname}', '${paramvalue}', '${time}', '${time}', '0', NULL, NULL,'${paramdesc}')`
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
module.exports = medicalLndicatorActions