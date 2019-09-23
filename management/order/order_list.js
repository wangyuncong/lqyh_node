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
    let type = req.query.type || ''
    let pageIndex = (req.query.pageIndex-1) * 10 || 0
    let sql = ''
    // 'select order_info from order_info inner join user_info on order_info.userid=user_info.id'
    if(type == 'taocan'){
        sql = `select order_info.*,user_info.name as name,addr_info.addrinfo as addrinfo from (order_info order_info inner join user_info on order_info.userid=user_info.id) inner join addr_info on order_info.addrid=addr_info.id where order_info.isdelete='0' and order_info.startdate like '%-%' and order_info.enddate like '%-%' order by order_info.createtime desc limit ${pageIndex}, 10`
        sql1 = `select count(*) from (order_info order_info inner join user_info on order_info.userid=user_info.id) inner join addr_info on order_info.addrid=addr_info.id where order_info.isdelete='0' and order_info.startdate like '%-%' and order_info.enddate like '%-%'`
    }else{
        sql = `select order_info.*,user_info.name as name,addr_info.addrinfo as addrinfo from (order_info order_info inner join user_info on order_info.userid=user_info.id) inner join addr_info on order_info.addrid=addr_info.id where order_info.isdelete='0' and order_info.startdate is NULL or order_info.startdate='null' order by order_info.createtime desc limit ${pageIndex}, 10`
        sql1 = `select count(*) from (order_info order_info inner join user_info on order_info.userid=user_info.id) inner join addr_info on order_info.addrid=addr_info.id where order_info.isdelete='0' and order_info.startdate is NULL or order_info.startdate='null'`
    }
    console.log(sql,'sql')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        connection.query(sql1, function (err, result1) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let arrorderids = []
            result.map((item) => {
                arrorderids.push(item.id)
            })
            arrorderids = Array.from(new Set(arrorderids))
            let slq3 = `select a.*,b.foodname as foodname from order_info_detail a, food_info b where a.isdelete=0 and b.isdelete=0 and a.goodid=b.id and orderid in (${arrorderids})`
            connection.query(slq3, function (err, result3) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                result.map((item) => {
                    item.foodInfo=[]
                    result3.map((item3) => {
                        if (item.id == item3.orderid) {
                            item.foodInfo.push(item3)
                        }
                    })
                })
                data.pageData.total = result1[0]['count(*)']
                data.data = result
                returnContent.status='success'
                returnContent.data = data
                res.send(returnContent);
            })
            
        })
        
    })
}
module.exports = cateGoryList