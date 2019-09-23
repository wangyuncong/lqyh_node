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
    // console.log(req.query.filter,'req.query.filter')
    
    
    let sql = ''
    
    if(req.query.filter){
        let pageIndex = (req.query.pageIndex-1) * 10 || 0
        let filter = JSON.parse(req.query.filter)
        if(filter.typename == ''){
            sql = `select * from food_menu_info where menuname like '%${filter.menuname == ''?'%':filter.menuname}%' and menucode like '%${filter.menucode == ''?'%':filter.menucode}%' and isdelete='0' limit ${pageIndex}, 10`
            sql1 = `select count(*) from food_menu_info where menuname like '%${filter.menuname == ''?'%':filter.menuname}%' and menucode like '%${filter.menucode == ''?'%':filter.menucode}%' and isdelete='0'`
        }else{
            sql = `select * from food_menu_info a,food_menu_detail_info b where a.menuname like '%${filter.menuname == ''?'%':filter.menuname}%' and a.menucode like '%${filter.menucode == ''?'%':filter.menucode}%' and b.foodcode='${filter.typename}' and a.id=b.menuid and a.isdelete=0 and b.isdelete=0 limit ${pageIndex}, 10`
            sql1 = `select count(*) from food_menu_info a,food_menu_detail_info b where a.menuname like '%${filter.menuname == ''?'%':filter.menuname}%' and a.menucode like '%${filter.menucode == ''?'%':filter.menucode}%' and b.foodcode='${filter.typename}' and a.id=b.menuid and a.isdelete=0 and b.isdelete=0`
        }
    }else{
        // console.log('0000000')
        sql = `select * from food_menu_info where isdelete=0`
        sql1 = `select count(*) from food_menu_info where isdelete=0`
    }
    
    
    // console.log(sql,'sql')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
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