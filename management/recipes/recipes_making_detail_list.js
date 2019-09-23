const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let data = {
        pageData:{
            total:0,
            pageIndex:req.query.pageIndex,
            pageSize:10
        },
        data:[]
    }
    // let pageIndex = (req.query.pageIndex-1) * 10 || 0
    let id = req.query.id
    let sql = `select * from food_menu_detail_info a,food_menu_info b where a.menuid=b.id and a.menuid = '${id}' and a.isdelete=0 and b.isdelete=0`
    // let sql = `select * from food_menu_detail_info where menuid='${id}' and isdelete='0' limit ${pageIndex}, 10`
    // console.log(sql)
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        let sql1 = `select count(*) from food_menu_detail_info a,food_menu_info b where a.menuid=b.id and a.menuid = '${id}' and a.isdelete=0 and b.isdelete=0`
        connection.query(sql1, function (err, result1) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            data.pageData.total = result1[0]['count(*)']
            data.data = result
            returnContent.status='success'
            returnContent.data = data
            res.send(returnContent);
        })
    })
}
module.exports = cateGoryList