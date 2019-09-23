const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let replierid = req.query.replierid
    let userid = req.query.userid
    let id = req.query.id
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    
    let sql = `select * from communication_dietitian_info where isdelete=0 and id='${id}'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        let info = result[0]
        let sql2 = `insert into communication_dietitian_info(replierid, userid, status, isdelete, createtime, updatetime, content) values ('${replierid}', '${userid}', 1, 0, '${time}', '${time}', '${info.content}')`
        connection.query(sql2, function (err, result2) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result2.serverStatus == 2){
                let sql3 = `update communication_dietitian_info set status=0 where id=${id}`
                connection.query(sql3, function (err, result3) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    if(result3.message){
                        // returnContent.status = 'success'
                        let sql4 = `update communication_info set replierid='${replierid}' where userid=${userid} and replierid is not null and replierid!=''`
                        connection.query(sql4, function (err, result4) {
                            if (err) {
                                return res.end('[SELECT ERROR] - ' + err.message);
                            }
                            if(result4.message){
                                returnContent.status = 'success'
                                res.send(returnContent)
                            }
                        })
                        
                    }
                    
                })
            }
            
        })
    })

}
module.exports = cateGoryActions