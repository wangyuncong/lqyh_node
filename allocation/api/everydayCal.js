const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', valuetime } = req.body
        // 获取我的信息
        let msg = await query(unity.sqlQuery('medical_indicator_info'))
        var list = []
        msg.map(s => {
            list.push(query(unity.sqlQuery('medical_indicator_value', {
                valuetime,
                userid,
                indicatorid: s.id
            })))
        })
        await Promise.all(list).then(s => {
            s.forEach((v, i) => {
                msg[i].msg = v[0]
            })
        })
        res.send({
            data: {
                msg
            },
            status: 0
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList