const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let fooddealid = req.query.fooddealid || ''
    // let fooddealidstr = fooddealid.split(',')
    // console.log(userid,'sdss')
    let sql = `select * from order_menu_info where fooddealid='${fooddealid}' and isdelete=0`
    // console.log(sql,'sssss')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        // console.log(result,'result')
        let arr = []
        result.length>0 && result.map((item,index)=>{
            item.foodmenuinfo = []
            item.foodmenuid.split(',').map((item2,index2)=>{
                arr.push(Number(item2))
            })
        })
        arr = Array.from(new Set(arr))
        
        let sql1 = `select * from food_menu_info where id in (${arr.length>0?arr:'""'}) and isdelete=0`
        // console.log(sql1,'sallllll')
        connection.query(sql1, function (err, result1) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            // console.log(result1,'result1')
            result.length>0 && result.map((item,index)=>{
                item.foodmenuid.split(',').map((item2,index2)=>{
                    result1.map((item3,index3)=>{
                        if(item2 == item3.id){
                            item.foodmenuinfo.push(item3)
                        }
                    })
                })
            })
            returnContent.data = result
            returnContent.status = 'success'
            res.send(returnContent)
        })
        
    })
}
module.exports = cateGoryList