var crypto = require('crypto') //引入加密模块
const https = require('https')
const unity = require('./unity')
const config = require('../../config.json')
//链接数据库
const query = require('../../mysql_config')
let imgAdd = async (req, res) => {
    var { url } = req.body
    https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${global.access_token_pl}&type=jsapi`, result => {
        result.on('data', (data2) => {
            var noncestr = 'Wm3WZYTPz0wzccnW'
            var timestamp = unity.nowTimestamp()
            var jsapi_ticket = JSON.parse(data2).ticket
            const hashCode = crypto.createHash('sha1'); //创建加密类型 
            var qianming = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
            var resultCode = hashCode.update(qianming, 'utf8').digest('hex'); //对传入的字符串进行加密
            res.send({
                noncestr,
                timestamp,
                jsapi_ticket,
                appid: config.appid,
                resultCode,
                url,
                share: {
                    title: '专业贴心的营养配餐服务',
                    desc: `接受朋友邀请关注“${global.sysparam.filter(s =>s.id == 29)[0].paramvalue}”，即得10元代金券`,
                    imgUrl: "http://bjyyq.zhaoshuikan.com.cn/static/images/bdc3ca4109f57e78846eb74ab664015.png"
                }
            })
        })
    })
}
module.exports = imgAdd