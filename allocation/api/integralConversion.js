const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        // 商品id
        let { userid = '', id = '',goodid ='' } = req.body
        // 拿到用户所有的数据
        const user_info = await query(`select * from user_info where isdelete='0' and id="${userid}"`)
        var mycent = user_info[0].mycent //积分
        // 拿到商品数据
        const commodity = await query(`select * from centshop_good_info where isdelete='0' and id="${id}"`)
        var jifen = commodity[0].goodcent
        if (jifen > mycent) {
            res.send({
                status: 501,
                msg: "积分不足！",
                integral: mycent
            })
            return
        }
        var shanpin = {}
        // 判断商品类型
        // 获取当前时间
        var createtime = unity.getNowFormatDate()
        if (commodity[0].type == 0) {
            // 优惠券信息
            shanpin = await query(`select * from coupon_info where isdelete='0' and id="${goodid}"`)
            // 优惠券表
            await query(unity.sqlAdd('user_coupon_info', {
                userid,
                couponid: goodid,
                createtime,
                isdelete: 0,
                expiredate: unity.countDate(shanpin[0].updatetime || shanpin[0].createtime, shanpin[0].period),
                status: 0,
                coupontype: 0
            }))
        }
        // 积分变动信息
        await query(
            unity.sqlAdd('user_cent_detail', {
                type: 0,
                operdesc: `购买${commodity[0].goodname}`,
                createtime,
                isdelete: 0,
                centamount: jifen,
                userid
            }))
        // 更改用户信息
        await query(`UPDATE user_info SET mycent = '${mycent - jifen}' WHERE id = '${userid}'`)

        res.send({
            status: 200,
            msg: "兑换成功！",
            integral: mycent - jifen
        })
    } catch (error) {
        console.log(error);

    }
}
module.exports = addressList