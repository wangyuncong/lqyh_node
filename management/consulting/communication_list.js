const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let replierid = req.query.replierid
    let sql = ''
    // if(replierid){
    //     sql = `select * from communication_info a, user_info b where a.isdelete='0' and b.isdelete=0 and a.userid=b.id and replierid='${replierid}' and readtype=1`
    // }else{
    //     sql = `select * from communication_info a, user_info b where a.isdelete='0' and b.isdelete=0 and a.userid=b.id and readtype=0`
    // }
    if(replierid){
        sql = `select * from user_info b, communication_dietitian_info a where a.isdelete='0' and b.isdelete=0 and a.userid=b.id and a.replierid='${replierid}' and a.status=1`
    }else{
        sql = `select * from user_info b, communication_dietitian_info a where a.isdelete='0' and b.isdelete=0 and a.userid=b.id and a.replierid=''`
    }
    // console.log(sql,'sql')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.length>0){
            let arruserid = []
            result.map((item)=>{
                arruserid.push(item.userid)
            })
            arruserid = Array.from(new Set(arruserid))
            let sql2 = `select * from user_basic_info b where userid in (${arruserid.length>0?arruserid:'""'}) and type=1 and dataname='name'`
            connection.query(sql2, function (err, result2) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                console.log(result2,'result2')
                result.length>0 && result.map((item,index)=>{
                    result2.map((item3,index3)=>{
                        // console.log(item3.id,'item3.id')
                        if(item.userid == item3.userid){
                            item.userinfo = item3
                        }
                    })
                })
                returnContent.status = 'success'
                returnContent.data = result
                res.send(returnContent)
            })
        }else{
            returnContent.status = 'success'
            returnContent.data = []
            res.send(returnContent)
        }
        
        
    })
}
module.exports = cateGoryList