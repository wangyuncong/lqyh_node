const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let sql = `select * from statement_info where isdelete='0' and statetypeid='2018191'`
    console.log(sql,'sql')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        let arr = []
        result.map((item)=>{
            let obj = {}
            if(item.statement!='编码' && item.statement!='水分' && item.statement!='食部'){
                obj.statement = item.statement
                obj.unit = item.unit
                obj.pym = item.pym
                arr.push(obj)
            }
        })
        returnContent.status = 'success'
        returnContent.data = arr
        res.send(returnContent)
    })
}
module.exports = cateGoryList