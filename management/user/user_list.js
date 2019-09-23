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
    let pageIndex = (req.query.pageIndex-1) * 10 || 0
    let searchKey = req.query.searchKey
    let searchValue = req.query.searchValue
    let sql = ''
    let sql1 = ''
    if(searchKey =='' || searchValue==''){
        sql = `select * from user_info where isdelete='0' order by roleid desc limit ${pageIndex}, 10`
        sql1 = `select count(*) from user_info where isdelete='0'`
    }else{
        sql = `select * from user_info where isdelete='0' and ${searchKey} like '%${searchValue}%' order by roleid desc limit ${pageIndex}, 10`
        sql1 = `select count(*) from user_info where isdelete='0' and '${searchKey}' like '%${searchValue}%'`
    }
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        connection.query(sql1, function (err, result1) {    
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            
            let sql2 = `select * from role_info a,user_info b where b.roleid=a.id and b.isdelete=0 and a.isdelete=0`
            connection.query(sql2, function (err, result2) {    
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                // console.log(result2)
                let arr = result
                arr.map((item)=>{
                    item.rolename = null
                    result2.map((item1)=>{
                        
                        if(item.id == item1.id){
                            // console.log(item1,'pppppp')
                            item.rolename = item1.rolename
                        }
                    })
                })
                // console.log(arr,'arr')
                data.pageData.total = result1[0]['count(*)']
                data.data = arr
                returnContent.status='success'
                returnContent.data = data
                res.send(returnContent);
            })
            
        })
    })
}
module.exports = cateGoryList