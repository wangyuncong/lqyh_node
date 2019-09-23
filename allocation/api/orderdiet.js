const fs = require('fs')
const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let orderdiet = async (req, res) => {
    try {
        let { userid = '', date = '', orderid = "" } = req.body
        if (date === '') {
            res.send({
                status: 501,
                msg: "请选择配餐时间！"
            })
            return
        }
        let order_deal_info = await query(unity.sqlQuery('order_deal_info', {
            orderid,
            orderdate: date
        }))
        let order_action_info = await query(unity.sqlQuery('order_action_info', {
            orderid
        }))
        // 查询订单详情
        let msg = await query(unity.sqlQuery('order_info_detail', {
            orderid
        }))
        // 查询订单简介
        let order_info = await query(unity.sqlQuery('order_info', {
            id: orderid
        }))
        var msgList = []
        msg.map((s, i) => {
            let xinxi = query(`select * from food_info where isdelete='0' and id='${msg[i].goodid}'`)
            msgList.push(xinxi)
        })
        await Promise.all([...msgList]).then(s => {
            s.forEach((v, i_) => {
                msg[i_].commodity = v
            })
        })
        if (order_deal_info.length == '') {
            res.send({
                status: 0,
                data: {
                    order_deal_info: [],
                    msg: msg,
                    order_menu_info: [],
                    order_info: order_info[0],
                    order_action_info
                }
            })
            return
        }
        let order_menu_info = await query(unity.sqlQuery('order_menu_info', {
            fooddealid: order_deal_info[0].id
        }))
        for (let index = 0; index < order_menu_info.length; index++) {
            const element = order_menu_info[index];
            let ms = await query(unity.sqlQuery('food_menu_info', {
                id: element.foodmenuid
            }))
            element.msg = ms[0]
        }
        res.send({
            status: 0,
            data: {
                msg: msg,
                order_deal_info,
                order_menu_info,
                order_info: order_info[0],
                order_action_info
            }
        })
    } catch (error) {
        console.log(error);
    }

}
module.exports = orderdiet