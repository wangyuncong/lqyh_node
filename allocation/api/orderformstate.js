const fs = require('fs')
const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let orderdiet = async (req, res) => {
    try {
        /**
         * @param status  0(删除订单) 1（支付） 2（取消订单）  3(执行完成)
         * @param remark1 是优惠券 对个,分割
         * */
        let { userid = '', status = '', id = '', remark1 = "" } = req.body
        var data = {}
        switch (status) {
            case 0:
                // 删除订单
                await query(unity.sqlUpdate('order_info', {
                    id
                }, {
                    isdelete: 1
                }))
                await query(unity.sqlAdd('order_action_info', {
                    actionname: "删除订单",
                    createtime: unity.getNowFormatDate(),
                    updatetime: unity.getNowFormatDate(),
                    isdelete: 0,
                    userid,
                    actionseq: 5,
                    orderid: id,
                    actiondesc: "手动通过公众号删除订单"
                }))
                data = {
                    status: 0,
                    msg: "订单已删除！"
                }
                break;
            case 1:
                // 支付
                data = {
                    status: 0,
                    msg: "支付成功！"
                }
                break;
            case 3:
                // 执行完成
                await query(unity.sqlUpdate('order_info', {
                    id
                }, {
                    status: 2
                }))
                data = {
                    status: 0,
                    msg: "执行完成！"
                }
                break;
            case 2:
                // 取消订单
                await query(unity.sqlUpdate('order_info', {
                    id
                }, {
                    status: 3
                }))
                // 如果存在已经使用的优惠券
                if (remark1) {
                    remark1.split(',').forEach(s => {
                        query(unity.sqlUpdate('user_coupon_info', {
                            id: s
                        }, {
                            status: 0
                        }))
                    })
                }
                await query(unity.sqlAdd('order_action_info', {
                    actionname: "取消订单",
                    createtime: unity.getNowFormatDate(),
                    updatetime: unity.getNowFormatDate(),
                    isdelete: 0,
                    actionseq: 6,
                    userid,
                    orderid: id,
                    actiondesc: "手动通过公众号取消订单"
                }))
                data = {
                    status: 0,
                    msg: "订单已取消！"
                }
                break;
            default:
                data = {
                    status: 0,
                    data: {
                        msg: msg[0],
                        order_deal_info,
                        order_menu_info,
                        order_action_info
                    }
                }
                break;
        }
        res.send(data)
    } catch (error) {
        console.log(error);
    }

}
module.exports = orderdiet