const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    // console.log('//////')
    let foodmenuid = req.body.foodmenuid
    let ordermenuid = req.body.ordermenuid
    let ingredientsInfo = JSON.parse(req.body.ingredientsInfo)
    // let recipes = JSON.parse(req.query.recipes)
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let str = ''
    
    ingredientsInfo.map((item,index)=>{
        if(index == 0){
            str+=` ('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${foodmenuid}','0','${ordermenuid}','${item.name}' )`  
        }else{
            str+=`,('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${foodmenuid}','0','${ordermenuid}','${item.name}' )`  
        }
    })
    // if(id){
        let sql1 = `update order_menu_detail_info set isdelete='1' where ordermenuid='${ordermenuid}' and foodmenuid=${foodmenuid}`
        connection.query(sql1, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                let sql = `insert into order_menu_detail_info(foodcode, foodmetacode, weightratio, seqno, remark1, remark2,foodmenuid,isdelete,ordermenuid,foodname) values ${str}`
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
    // }else{
    // }
}
module.exports = cateGoryActions