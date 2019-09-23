const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid
    let nutrients = JSON.parse(req.query.nutrients)
    let sql = `update nutritionist_nutrition_list set isdelete=1 where userid=${userid}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.message){
            let str = ''
            nutrients.length>0 && nutrients.map((item,index)=>{
                if(index == 0){
                    str+=` ('${item.indexname}', '${userid}', '0', NULL, NULL,'${item.unit}','${item.pym}')`  
                }else{
                    str+=`,('${item.indexname}', '${userid}', '0', NULL, NULL,'${item.unit}','${item.pym}')`  
                }
            })
            let sql = `insert into nutritionist_nutrition_list(indexname, userid, isdelete, remark1, remark2, unit, pym) values ${str}`
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
    })  
}
module.exports = cateGoryList