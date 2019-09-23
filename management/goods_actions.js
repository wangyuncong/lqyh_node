const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let foodid = req.query.foodid
    let foodname = req.query.foodname
    let fooddesc = req.query.fooddesc
    let foodtrans = req.query.foodtrans || '123123'
    let foodkeyword = req.query.foodkeyword
    let foodpicbig = req.query.foodpicbig
    let foodpicsmall = req.query.foodpicsmall
    let foodprice = req.query.foodprice
    let catagoryid = req.query.catagoryid
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(foodid){
        let sql = `update food_info set foodname='${foodname}', fooddesc='${fooddesc}', foodtrans='${foodtrans}', foodkeyword='${foodkeyword}',foodpicbig='${foodpicbig}',foodpicsmall='${foodpicsmall}',foodprice='${foodprice}', updatetime='${time}' where id=${foodid}`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let sql1 = `update food_category_relation set catagoryid=${catagoryid} where foodid=${foodid}`
            connection.query(sql1, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if(result1.message){
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        })
    }else{
        let sql = `insert into food_info(foodname, fooddesc, createtime, updatetime, isdelete, remark1, remark2, foodpicbig, foodpicsmall,foodprice,remark3,remark4,remark5,remark6,remark7,remark8,remark9,remark10,foodkeyword,foodtrans) values ('${foodname}', '${fooddesc}', '${time}', '${time}', '0', NULL, NULL,'${foodpicbig}','${foodpicsmall}','${foodprice}',NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,'${foodkeyword}','${foodtrans}')`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let sql1 = `insert into food_category_relation(catagoryid,foodid,createtime, updatetime,isdelete, remark1, remark2) values ('${catagoryid}','${result.insertId}', '${time}', '${time}','0', NULL, NULL)`
            connection.query(sql1, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if(result1.serverStatus == 2){
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        })
    }
}
module.exports = cateGoryActions