const mysql = require('mysql')
//链接数据库
const connection = require('../session_mysql.js').connection
let getMenus = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let roleid = req.query.roleid
    let type = req.query.type
    if(type){
        // console.log(roleid,'roleid')
        let sql = `select * from menu_auth_info a,menu_info b where a.menuid=b.id and a.isdelete=0 and b.isdelete=0 and a.roleid='${roleid}'`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let arr = []
            result.map((item)=>{
                let obj = {}
                if(!item.parentid){
                    obj.name = item.menuname
                    obj.path = item.menudesc
                    obj.menuid = item.menuid
                    obj.children = []
                    arr.push(obj)
                }
                
            })
            arr.map((item1)=>{
                result.map((item2)=>{
                    if(item2.parentid == item1.menuid){
                        // console.log(item1,'item1')
                        item2.name = item2.menuname
                        item2.path = item2.menudesc
                        item1.children.push(item2)
                    }
                })
            })
            returnContent.status = 'success'
            returnContent.data = arr
            res.send(returnContent)
        })
    }else{
        let sql = `select * from menu_info where isdelete=0`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            returnContent.status = 'success'
            returnContent.data = result
            res.send(returnContent)
        })
    }
    
}
module.exports = getMenus