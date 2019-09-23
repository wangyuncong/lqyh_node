const mysql = require('mysql')
const sd = require('silly-datetime')
const request = require('request')
const xmlreader = require("xmlreader")
const fs = require("fs");
let wxpay = require('../../util.js');
let config = require('../../config');

//链接数据库
const connection = require('../../session_mysql.js').connection
let Pay = (req, res) => {
    //首先拿到前端传过来的参数
    global.total_fee = 0
    global.out_trade_no = ''
    let ordernumber = req.query.ordernumber
    let userid = req.query.userid
    let orderid = req.query.orderid
    let money = 0
    let sql = `select * from order_info where userid='${userid}' and id='${orderid}' and isdelete=0`
    connection.query(sql, function (err, result) {
        console.log(err,result,'vvvvvvv')
        if (err) {
            return res.send('[SELECT ERROR] - ' + err.message);
        }
        result.map((item,index)=>{
            money += item.realamount
        })
    })

    // let money = req.query.money;
    // let orderID = req.query.orderID;

    // console.log('APP传过来的参数是', orderCode + '----' + money + '------' + orderID + '----' + appid + '-----' + appsecret + '-----' + mchid + '-----' + mchkey);

    //首先生成签名sign
    let orderCode = ordernumber
    let appid = config.appid
    let mch_id = config.mchid
    let mchkey = config.mchkey
    let nonce_str = wxpay.createNonceStr()
    let timestamp = wxpay.createTimeStamp()
    let body = '另起一行-套餐订单支付'
    let out_trade_no = orderCode
    let total_fee = Number(money)
    let spbill_create_ip = req.connection.remoteAddress
    let notify_url = config.notify_url
    let trade_type = 'JSAPI'
    let attach = JSON.stringify({orderid:orderid,userid:userid})

    let sign = wxpay.paysignjsapi(config.appid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

    console.log('sign==', sign);

    //组装xml数据
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>";  //appid
    formData += "<body><![CDATA[" + body + "]]></body>";
    formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>" + trade_type + "</trade_type>";
    formData += "<sign>" + sign + "</sign>";
    formData += "<attach>"+attach+"</attach>"
    formData += "</xml>";

    console.log('formData===', formData);

    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

    request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);

            xmlreader.read(body.toString("utf-8"), function (errors, response) {
                if (null !== errors) {
                    console.log(errors)
                    return;
                }
                if(	response.xml.return_code.text() == 'FAIL'){
                    let returnContent = {
                        data:response.xml.return_msg.text(),
                        status:'error'
                    }
                    res.send(returnContent)
                }else{
                    if(response.xml.return_code.text() == 'SUCCESS' && response.xml.result_code.text()!=='SUCCESS'){
                        let returnContent = {
                            data:response.xml.err_code_des.text(),
                            status:'error'
                        }
                        res.send(returnContent)
                    }else{
                        let sql = `insert into order_pay_info(orderid, userid, createtime, updatetime, isdelete, remark1, remark2,payremark,method,paytime,operid,payserial,status,amount) values ('${orderid}', '${userid}', '${time}', '${time}',0,NULL,NULL,NULL,0,,NULL,'微信支付',NULL,4,'${money}')`
                        connection.query(sql, function (err, result) {
                            if (err) {
                                return res.end('[SELECT ERROR] - ' + err.message);
                            }
                            
                            if(result.serverStatus == 2){
                                // returnContent.status = 'success'
                                console.log('长度===', response.xml.prepay_id.text().length);
                                var prepay_id = response.xml.prepay_id.text();
                                console.log('解析后的prepay_id==', prepay_id);
                                global.total_fee = total_fee
                                global.out_trade_no = out_trade_no
                                //将预支付订单和其他信息一起签名后返回给前端
                                let finalsign = wxpay.paysignjsapifinal(appid, mch_id, prepay_id, nonce_str, timestamp, mchkey);
                                let returnContent = {
                                    data:{ 'appId': appid, 'partnerId': mchid, 'prepayId': prepay_id, 'nonceStr': nonce_str, 'timeStamp': timestamp, 'package': 'Sign=WXPay', 'sign': finalsign },
                                    status:'success'
                                }
                                res.send(returnContent)
                            }
                            
                        })
                        
                    }
                }
            })
        }
    })
}
module.exports = Pay