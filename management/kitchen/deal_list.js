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
    // console.log(req.query,'console.log(req.query)')
    let pageIndex = (req.query.pageIndex-1) * 10 || 0
    let orderdate = req.query.orderdate || ''
    let mealtype = req.query.mealtype
    let sql = ''
    let sql4 = ''
    if(orderdate == '' && mealtype == ''){
        sql = `select a.*,b.*,c.status as c_status1,c.ordernumber as ordernumber from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0' order by b.fooddealid asc limit ${pageIndex}, 10`
        sql4 = `select count(*) from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0'`
    }else if(orderdate != '' && mealtype == ''){
        sql = `select a.*,b.*,c.status as c_status1,ordernumber as ordernumber from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.orderdate='${orderdate}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0' order by b.fooddealid asc limit ${pageIndex}, 10`
        sql4 = `select count(*) from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.orderdate='${orderdate}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0'`
    }else if(orderdate == '' && mealtype != ''){
        sql = `select a.*,b.*,c.status as c_status1,ordernumber as ordernumber from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and b.mealtype='${mealtype}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0' order by b.fooddealid asc limit ${pageIndex}, 10`
        sql4 = `select count(*) from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and b.mealtype='${mealtype}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0'`
    }else if(orderdate != '' && mealtype != ''){
        sql = `select a.*,b.*,c.status as c_status1,ordernumber as ordernumber from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.orderdate='${orderdate}' and b.mealtype='${mealtype}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0' order by b.fooddealid asc limit ${pageIndex}, 10`
        sql4 = `select count(*) from order_deal_info a, order_menu_info b, order_info c where a.orderid=c.id and a.orderdate='${orderdate}' and b.mealtype='${mealtype}' and a.id=b.fooddealid and a.status!=0 and a.isdelete='0' and b.isdelete='0'`
    }
    
    console.log(sql4,'///////')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        let arr = []
        result.length>0 && result.map((item,index)=>{
            item.foodmenuinfo = []
            item.userinfo = ''
            item.foodmenuid.split(',').map((item2,index2)=>{
                arr.push(Number(item2))
            })
        })
        arr = Array.from(new Set(arr))
        
        let sql1 = `select * from food_menu_info where id in (${arr.length>0?arr:'""'}) and isdelete=0`
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
            let arr1 = []
            result.length>0 && result.map((item,index)=>{
                arr1.push(item.orderid)
            })
            arr1 = Array.from(new Set(arr1))
            // console.log(arr1,'arr1')
            let sql2 = `select * from user_basic_info b,order_info a where a.id in (${arr1.length>0?arr1:'""'}) and a.userid=b.userid and b.type=1 and b.dataname='name' and a.isdelete=0 and b.isdelete=0`
            // console.log(sql2,'sql2')
            connection.query(sql2, function (err, result2) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                // console.log(result2,'ss')
                result.length>0 && result.map((item,index)=>{
                    result2.map((item3,index3)=>{
                        // console.log(item3.id,'item3.id')
                        if(item.orderid == item3.id){
                            item.userinfo = item3
                        }
                    })
                })
                connection.query(sql4, function (err, result4) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    data.pageData.total = result4[0]['count(*)']
                    data.data = result
                    returnContent.status='success'
                    returnContent.data = data
                    res.send(returnContent);
                })
            })
        })
    })
}
module.exports = cateGoryList