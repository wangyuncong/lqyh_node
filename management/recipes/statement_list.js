const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let typename = req.query.typename
    let type = req.query.type
    
    let typeid = JSON.parse(req.query.typeid) || []
    let arr = []
    typeid.map((item)=>{
        arr.push(item.typeid)
    })
    // console.log(typeid,'typeid')
    if(type == 'shicai_params'){
        let sql = `select * from statement_info where isdelete=0 and statetypeid in (${arr})`
        // console.log(sql,'ss')
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let arr = []
            // console.log(typeid,'typeid')
            typeid.map((item1)=>{
                let obj = {
                    foodcode:item1.typeid,
                    name:item1.typename,
                    weightratio:''
                }
                // console.log(result,'itemtitemme')
                result.length>0 && result.map((item,index)=>{
                    if(item1.typeid==item.statetypeid){
                        returnContent.status = 'success'
                        obj[item.pym] = item
                    }
                })
                if(item1.weightratio){
                    obj.weightratio = item1.weightratio
                }
                arr.push(obj)
            })
            returnContent.data = arr
            res.send(returnContent)
        })
    }else{
        let sql = `select * from statement_type_info where typename like '%${typename}%' and isdelete=0`
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
module.exports = cateGoryList