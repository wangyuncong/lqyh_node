const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    let { userid = '' } = req.body
    // 拿到用户所有的数据
    const rows = await query(unity.sqlQuery('user_basic_info', { userid, type: 1 }))
    res.send({
        status: 0,
        data: rows
    })
}
module.exports = addressList