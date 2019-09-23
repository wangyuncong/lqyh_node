const mysql = require('mysql')
const sd = require('silly-datetime')
let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
//链接数据库
const connection = require('../session_mysql.js').connection   
let login = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {username,password} = req.query
    let sql1 = `select * from user_info where isdelete='0' and username='${username}' and password='${password}'`
    connection.query(sql1, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.length > 0){
            returnContent.status = 'success'
            returnContent.data = result
        }else{
            returnContent.status = 'error'
            returnContent.data = '请输入正确的用户名和密码'
        }
        res.send(returnContent)
    })
}
module.exports = login