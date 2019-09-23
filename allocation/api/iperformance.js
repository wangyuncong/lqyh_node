const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', element = [] } = req.body
        // 获取我的信息
        let msg = await query(unity.sqlQuery('user_info', { id: userid }))
        // 获取自己的所有推广人
        let bd_infoList = await query(unity.sqlQuery('bd_info', { duserid: userid }))
        var bd_info = []
        bd_infoList.map(async s => {
            let value = await query(unity.sqlQuery('user_info', { id: s.cuserid }))
            if (value[0] && value[0].roleid) {
                bd_info.push(s)
            }
        })
        // 销售记录 根据此业绩对应的医生id来查询是不是自己下面的用户
        let cm_detail_info = await query(unity.sqlQuery('cm_detail_info', { doctorid: userid }))
        var list = []
        // 查询订单详情
        cm_detail_info.filter(s => list.push(query(unity.sqlQuery('order_info_detail', { orderid: s.orderid }))))
        await Promise.all(list).then(async s => {
            for (let i = 0; i < s.length; i++) {
                let v = s[i];
                let msg = await query(unity.sqlQuery('food_info', { id: v[0].goodid }))
                cm_detail_info[i].msg = msg[0]
            }
        })
        res.send({
            data: {
                msg: msg[0],
                bd_info,
                cm_detail_info,
            },
            status: 0
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList