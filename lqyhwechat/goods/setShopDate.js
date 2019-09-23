const mysql = require('mysql')
var sd = require('silly-datetime');
//链接数据库
const connection = require('../../session_mysql.js').connection
let setShopDate = (req, res) => {
    let returnContent = {
        status:'error',
        data:null
    }
    // console.log(req.query)
    let goodsId = req.query.goodsId
    let startdate = req.query.startdate
    let enddate = req.query.enddate
    let userId = req.query.userid
    let num = req.query.tianshu
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')

    let sql3 = `select goodid from shopping_cart_info where userid=${userId} and goodid=${goodsId} and isdelete='0'`
    // console.log(sql3,goodsId,'sql3')
    connection.query(sql3, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        
        if(result.length>0){
            
            let sql2 = `update shopping_cart_info set quantity=${num},days=${num}, startdate='${startdate}',enddate='${enddate}', updatetime='${time}' where goodid=${goodsId} and userid=${userId}`
            // console.log(sql2,'pp')
            connection.query(sql2, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                // console.log(result1.message)
                if (result1.message) {
                    res.send({
                        status: 'success'
                    })
                }
            })
        }else{
            let sql = `INSERT INTO shopping_cart_info(userid, goodid, createtime, updatetime, isdelete, remark1, remark2, startdate, enddate, days, quantity) VALUES ('${userId}', '${goodsId}', '${time}', '${time}', '0', NULL, NULL, '${startdate}', '${enddate}', '${num}','${num}')`
            connection.query(sql, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if (result1.serverStatus == 2) {
                    res.send({
                        status: 'success'
                    })
                }
            })
        }

        // returnContent.status = 'success'
        // returnContent.data = result
        // res.send(returnContent)
    })
    
}
module.exports = setShopDate