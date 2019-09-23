const mysql = require('mysql')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', orderid = '' } = req.body
        const rows = await query(`select * from order_info where orderid='${orderid}' and userid='${userid}'`)
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            // 查询订单信息详情
            let msg = await query(`select * from order_info_detail where isdelete='0' and orderid='${element.id}'`)
            element.infoMsg = msg[0]
            let xinxi = await query(`select * from food_info where isdelete='0' and id='${msg[0].goodid}'`)
            element.commodity = xinxi[0]
        }
        res.send({
            status: 0,
            data: rows
        })
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = addressList