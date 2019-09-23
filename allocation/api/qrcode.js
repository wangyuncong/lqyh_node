const https = require('https')
const unity = require('./unity')
const axios = require('axios')
var config = require('../../config');//引入配置文件    
const query = require('../../mysql_config')
function token(params) {
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`, (res) => {
        res.on('data', (d) => {
            global.access_token_pl = JSON.parse(d).access_token
        });
    })
}
let imgAdd = async (req, res) => {
    try {
        var { type, userid } = req.body
        if (userid == '') {
            res.send({
                status: 201,
                msg: "用户获取失败！"
            })
            return
        }
        // 先获取二维码判断是否存在
        let list = await query(unity.sqlQuery('user_qrcode_info', { userid }))
        if (list.length === 0) {
            if (type == 1) {
                linshi()
            } else {
                var contents = { "action_name": "QR_LIMIT_SCENE", "action_info": { "scene": { "scene_id": userid } } }
                axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${global.access_token_pl}`, contents)
                    .then(function (response) {
                        var img = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${response.data.ticket}`
                        if (response.data.ticket === 'undefined' || !response.data.ticket) {
                            token()
                            res.send({
                                status: 504,
                                msg: "二维码获取失败"
                            })
                            return
                        }
                        query(unity.sqlAdd('user_qrcode_info', { userid, qrcode: 0, qrcodeinfo: img, expiretime: unity.countDate('', 365 * 10), createtime: unity.getNowFormatDate() }))
                        res.send({
                            data: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${response.data.ticket}`,
                            status: 0
                        })
                    })
            }
        } else {
            if (unity.nowTimestamp() < unity.dependTimestamp(list[0].expiretime) / 1000) {
                res.send({
                    status: 0,
                    data: list[0].qrcodeinfo
                })
            } else {
                linshi(list[0])
            }
        }
        function linshi(sva) {
            // 临时二维码
            var contents = { "expire_seconds": 604800, "action_name": "QR_SCENE", "action_info": { "scene": { "scene_id": userid } } };
            axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${global.access_token_pl}`, contents)
                .then(function (response) {
                    var img = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${response.data.ticket}`
                    if (response.data.ticket === 'undefined' || !response.data.ticket) {
                        token()
                        res.send({
                            status: 504,
                            msg: "二维码获取失败"
                        })
                        return
                    }
                    if (!sva) {
                        query(unity.sqlAdd('user_qrcode_info', { userid, qrcode: 1, qrcodeinfo: img, expiretime: unity.countDate('', 29), createtime: unity.getNowFormatDate() }))
                    } else {
                        query(unity.sqlUpdate('user_qrcode_info', {
                            id: sva.id
                        }, {
                            qrcodeinfo: img,
                            expiretime: unity.countDate('', 29),
                            updatetime: unity.getNowFormatDate()
                        }))
                        // query(unity.sqlAlter('user_qrcode_info', { termKey: 'id', termValue: sva.id, alterKey: "qrcodeinfo", alterValue: img }))
                    }
                    res.send({
                        data: img,
                        status: 0
                    })
                })
        }
    } catch (error) {

    }
}
module.exports = imgAdd