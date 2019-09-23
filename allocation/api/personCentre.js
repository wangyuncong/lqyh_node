const mysql = require('mysql')
//链接数据库
const connection = require('../../mysql_config')
let addressList = (req, res) => {
    try {

        let returnContent = {
            status: 'error',
            data: null
        }
        let userid = req.query.userid
        let sql = `select * from addr_info where isdelete='0' and userid=${userid}`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            returnContent.status = 'success'
            returnContent.data = result
            res.send(returnContent)
        })
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = addressList