const mysql = require('mysql')
const sd = require('silly-datetime')

//链接数据库
const connection = require('../session_mysql.js').connection
let registered = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {username,password} = req.query
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let sql1 = `select * from user_info where isdelete='0' and username='${username}'`
    connection.query(sql1, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        // console.log(result,result.length)
        if(result.length > 0){
            returnContent.status = 'error'
            returnContent.data = '用户名已存在'
            res.send(returnContent)
        }else{
            insertUser()
        }
        
    })
    let insertUser = () => {
        let sql = `insert into user_info(username, password, createtime, updatetime, isdelete, remark1, remark2, openid, phonenum,remark3,remark4,remark5,remark6,roleid,mycent,name,img) values ('${username}', '${password}', '${time}', '${time}', '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`
        // console.log(sql,'sqllll')
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
module.exports = registered