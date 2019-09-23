const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.body.id
    let ingredientsInfo = JSON.parse(req.body.ingredientsInfo)
    let recipes = JSON.parse(req.body.recipes)
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let str = ''
    // console.log(ingredientsInfo,recipes)
    
    if(id){
        ingredientsInfo.map((item,index)=>{
            if(index == 0){
                str+=` ('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${id}','0','${item.name}'  )`  
            }else{
                str+=`,('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${id}','0','${item.name}'  )`  
            }
        })
        let {menuname,menucode,cooktype,cooktime,sweetness,menudesc,menupic} = recipes
        let sql2 = `update food_menu_info set menuname='${menuname}', menucode='${menucode}', cooktype='${cooktype}',cooktime='${cooktime}',sweetness='${sweetness}',menudesc='${menudesc}',menupic='${menupic}' where id=${id}`
        connection.query(sql2, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                let sql1 = `update food_menu_detail_info set isdelete='1' where menuid=${id}`
                connection.query(sql1, function (err, result) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    if(result.message){
                        let sql = `insert into food_menu_detail_info(foodcode, foodmetacode, weightratio, seqno, remark1, remark2,menuid,isdelete,foodname ) values ${str}`
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
        })
    }else{
        let {menuname,menucode,cooktype,cooktime,sweetness,menudesc,menupic} = recipes
        let sql1 = `insert into food_menu_info(menuname, menucode, cooktype, cooktime, sweetness, menudesc,menupic,remark1,remark2,tips,isdelete) values ('${menuname}','${menucode}','${cooktype}','${cooktime}','${sweetness}','${menudesc}','${menupic}',NULL,NULL,NULL,'0')`
        connection.query(sql1, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            // console.log(result.insertId)
            ingredientsInfo.map((item,index)=>{
                if(index == 0){
                    str+=` ('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${result.insertId}','0','${item.name}' )`  
                }else{
                    str+=`,('${item.foodcode}', NULL, '${item.weightratio}', NULL,NULL,NULL, '${result.insertId}','0','${item.name}'  )`  
                }
            })
            if(result.serverStatus == 2){
                let sql = `insert into food_menu_detail_info(foodcode, foodmetacode, weightratio, seqno, remark1, remark2,menuid,isdelete,foodname) values ${str}`
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
}
module.exports = cateGoryActions