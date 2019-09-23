const mysql = require('mysql')
//链接数据库
const unity = require('./unity')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '' } = req.body
        // 拿到用户所有的数据

        let rows = await query(unity.sqlQuery('order_info', {
            isdelete: 0,
            userid
        }, { descName: "id" }))
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            // 查询订单信息详情
            let msg = await query(`select * from order_info_detail where isdelete='0' and orderid='${element.id}'`)
            if (msg.length != 0) {
                element.infoMsg = msg[0]
                let xinxi = await query(`select * from food_info where isdelete='0' and id='${msg[0].goodid}'`)
                element.commodity = xinxi
            }

        }
        rows = rows.filter(s => s.commodity)
        res.send({
            status: 0,
            data: rows
        })
    } catch (err) {
        console.log(err);

    }
}
module.exports = addressList