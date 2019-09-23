const mysql = require('mysql')
//链接数据库
const unity = require('./unity')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', id, valuetime, value, unit } = req.body

        // 获取本条是否存在
        let ifp = await query(unity.sqlQuery('medical_indicator_value', {
            userid,
            valuetime,
            indicatorid: id
        }))
        // 更新数据
        if (ifp.length != 0) {
            await query(unity.sqlUpdate('medical_indicator_value', {
                userid,
                valuetime,
                indicatorid: id
            }, {
                updatetime: unity.getNowFormatDate(),
                unit: unit,
                indicatorvalue: value,
            }))
            res.send({
                status: 0
            })
            return
        }
        await query(unity.sqlAdd('medical_indicator_value', {
            indicatorid: id,
            userid,
            createtime: unity.getNowFormatDate(),
            isdelete: 0,
            unit: unit,
            indicatorvalue: value,
            valuetime: valuetime
        }))
        res.send({
            status: 0
        })
    } catch (err) {
        console.log(err);

    }
}
module.exports = addressList