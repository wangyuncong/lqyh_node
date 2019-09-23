const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../session_mysql.js').connection
let cateGoryDelete = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let sql = `DELETE food_info,food_category_relation from food_info LEFT JOIN food_category_relation ON food_info.id=food_category_relation.foodid WHERE food_info.id=${id}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result.serverStatus == 34) {
            returnContent.status = 'success'
        }
        res.send(returnContent)
    })
}
module.exports = cateGoryDelete