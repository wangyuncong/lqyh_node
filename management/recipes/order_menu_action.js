const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    // console.log(req.query,'sss')
    let {mealtype='',fooddealid='',menucent='',id,foodmenuid=''} = req.query
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    

    if(id){
        let sql = `update order_menu_info set menucent='${menucent}', foodmenuid='${foodmenuid}' where id='${id}'`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                let sql4 = `update order_menu_detail_info set isdelete='1' where ordermenuid='${id}'`
                connection.query(sql4, function (err, result) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    if(result.message){
                        let foodmenuidstr = foodmenuid.split(',')
                        let sql1 = `select * from food_menu_detail_info where menuid in (${foodmenuidstr}) and isdelete=0`
                        connection.query(sql1, function (err, result1) {
                            if (err) {
                                return res.end('[SELECT ERROR] - ' + err.message);
                            }
                            let arr = result1
                            let str = ''
                            arr.map((item,index)=>{
                                if(index == 0){
                                    str+=` ('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${item.menuid}','0','${id}','${item.foodname}' )`  
                                }else{
                                    str+=`,('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${item.menuid}','0','${id}','${item.foodname}' )`  
                                }
                            })
                            let sql2 = `insert into order_menu_detail_info(foodcode, foodmetacode, weightratio,seqno, remark1, remark2,foodmenuid,isdelete,ordermenuid,foodname) values ${str}`
                            // console.log(sql2,'sql2')
                            connection.query(sql2, function (err, result) {
                                if (err) {
                                    return res.end('[SELECT ERROR] - ' + err.message);
                                }
                                if(result.serverStatus == 2){
                                    returnContent.status = 'success'
                                }
                                res.send(returnContent)
                            })
                        })
                    }
                })
                
                // returnContent.status = 'success'
            }
            // res.send(returnContent)
        })

    }else{
        let sql = `insert into order_menu_info(mealtype, foodmenuid, menucent, remark1, remark2,isdelete,fooddealid) values ('${mealtype}', '${foodmenuid}', '${menucent}', NULL, NULL, '0','${fooddealid}')`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.serverStatus == 2){
                // console.log(result.insertId)
                let sql1 = `select * from food_menu_detail_info where menuid='${foodmenuid}' and isdelete=0`
                // console.log(sql,'ssssss')
                connection.query(sql1, function (err, result1) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    let arr = result1
                    let str = ''
                    arr.map((item,index)=>{
                        if(index == 0){
                            str+=` ('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${item.menuid}','0','${result.insertId}','${item.foodname}' )`  
                        }else{
                            str+=`,('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${item.menuid}','0','${result.insertId}','${item.foodname}' )`  
                        }
                    })
                    let sql2 = `insert into order_menu_detail_info(foodcode, foodmetacode, weightratio,seqno, remark1, remark2,foodmenuid,isdelete,ordermenuid,foodname) values ${str}`
                    // console.log(sql2,'sql2')
                    connection.query(sql2, function (err, result) {
                        if (err) {
                            return res.end('[SELECT ERROR] - ' + err.message);
                        }
                        if(result.serverStatus == 2){
                            returnContent.status = 'success'
                        }
                        res.send(returnContent)
                    })
                })
                // returnContent.status = 'success'
            }
            // res.send(returnContent)
        })
    }
}
module.exports = cateGoryList