const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '' } = req.body
        const rows = await query(unity.sqlQuery('centshop_good_info'))
        const user_info = await query(unity.sqlQuery('user_info', { id: userid }))
        const arr = []
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            // 判断条件日期是否过期
            if (unity.nowTimestamp() < (unity.dependTimestamp(element.expiretime) / 1000)) {
                if(element.type == 0){
                    var msg = await query(unity.sqlQuery('coupon_info', { id: element.goodid }))
                    element.msg = msg[0]
                }
                arr.push(element)
            }
        }
        res.send({
            status: 0,
            data: {
                info: user_info[0],
                rows: arr
            }
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList