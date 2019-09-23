const mysql = require('mysql')
//链接数据库
const connection = require('../session_mysql.js').connection
let preferentialList = (req, res) => {
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
    let pageIndex = (req.query.pageIndex-1) * 10 || 0
    let type = req.query.type
    // console.log(type,'ppp')
    let sql = `select * from coupon_info where isdelete='0' and type='${type}' limit ${pageIndex}, 10`
    // console.log(sql,'ppp')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        let sql1 = `select count(*) from coupon_info where isdelete='0'` 
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
module.exports = preferentialList