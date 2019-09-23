const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    let { userid = '' } = req.body
    // 拿到用户所有的数据
    const rows = await query(unity.sqlQuery('user_coupon_info', { userid }))
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        // 获取优惠券详情
        var msg = await query(unity.sqlQuery('coupon_info', { id: element.couponid }))
        element.msg = msg[0]
        // 判断条件日期是否过期
        if (unity.nowTimestamp() > unity.dependTimestamp(element.expiredate) / 1000 && element.status == 0) {
            // 更改过期的优惠券状态
            element.status = 2

            query(unity.sqlUpdate('user_coupon_info', {
                id: element.id
            }, {
                status: 2
            }))
            // query(unity.sqlAlter('user_coupon_info', { termKey: 'id', termValue: element.id, alterKey: 'status', alterValue: 2 }))
        }
    }
    res.send({
        status: 0,
        data: rows
    })
}
module.exports = addressList