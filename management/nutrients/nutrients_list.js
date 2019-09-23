const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid
    let sql = `select * from nutritionist_nutrition_list where isdelete='0' and userid='${userid}'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        console.log(result,'sss')
        if(result.length>0){
            returnContent.status = 'success'
            returnContent.data = result
            res.send(returnContent)
        }else{
           
            returnContent.status = 'success'
            returnContent.data = [{
                indexname:'能量',
                isdelete:0,
                unit:'kcal',
                pym:'nl'
            },{
                indexname:'蛋白质',
                isdelete:0,
                unit:'g',
                pym:'dbz'
            },{
                indexname:'脂肪',
                isdelete:0,
                unit:'g',
                pym:'zf'
            },{
                indexname:'碳水化合物',
                isdelete:0,
                unit:'g',
                pym:'tshhw'
            }]
            res.send(returnContent)
        }
        
    })
}
module.exports = cateGoryList