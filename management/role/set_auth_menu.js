const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    let {roleid,anthMenuIds} = req.query
    let sql = `update menu_auth_info set isdelete='${1}' where roleid=${roleid}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result.message) {
            let str = ''
            anthMenuIds.split(',').map((item,index)=>{
                if(index == 0){
                    str+=` ('${item}', '${roleid}', '${time}', '${time}', '0', NULL, NULL)`  
                }else{
                    str+=`,('${item}', '${roleid}', '${time}', '${time}', '0', NULL, NULL)`  
                }
                
            }) 
            let sql1 = `INSERT INTO menu_auth_info(menuid, roleid, createtime, updatetime, isdelete, remark1, remark2) VALUES ${str}`
            connection.query(sql1, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if(result.serverStatus == 2){
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        }
    })
}
module.exports = cateGoryList