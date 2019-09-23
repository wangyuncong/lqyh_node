const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../session_mysql.js').connection
let preferentialActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let couponname = req.query.couponname
    let status = req.query.status
    let period = req.query.period
    let discount = req.query.discount
    let limitamount = req.query.limitamount
    let foodcata = req.query.foodcata
    let type = req.query.type
    let operid = req.query.operid
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    // console.log(discount,limitamount)
    if(id){
        let sql = `update coupon_info set couponname='${couponname}', status='${status}', period='${period}',discount='${discount}',limitamount='${limitamount}',foodcata='${foodcata}', updatetime='${time}' where id=${id}`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                returnContent.status = 'success'
            }
            res.send(returnContent)
        })
    }else{
        let sql = `insert into coupon_info(type, foodcata, createtime, updatetime, isdelete, remark1, remark2,limitamount,discount,operid,period,status,couponname) values ('${type}', '${foodcata}', '${time}', '${time}', '0', NULL, NULL,'${limitamount}','${discount}','${operid}','${period}','${status}','${couponname}')`
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
module.exports = preferentialActions