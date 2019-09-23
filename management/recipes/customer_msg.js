const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid || '' 
    // console.log(userid,'sdss')
    let sql = `select * from user_basic_info where userid='${userid}' and type='1'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        // console.log(result)
        let obj = {}
        result.map((item,index)=>{
            obj[item.dataname] = item.datavalue
        })
        returnContent.status = 'success'
        returnContent.data = obj
        res.send(returnContent)
    })
}
module.exports = cateGoryList