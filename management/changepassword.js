const mysql = require('mysql')
const sd = require('silly-datetime')

//链接数据库
const connection = require('../session_mysql.js').connection
let changePassword = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {username,password,newpassword} = req.query
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let sql1 = `select * from user_info where isdelete='0' and username='${username}' and password='${password}'`
    connection.query(sql1, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.length > 0){
            changePass()
        }else{
            returnContent.status = 'error'
            returnContent.data = '请输入正确的旧密码'
            res.send(returnContent)
        }
        
    })
    let changePass = () => {
        let sql = `update user_info set password='${newpassword}', updatetime='${time}' where username='${username}'`
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
}
module.exports = changePassword