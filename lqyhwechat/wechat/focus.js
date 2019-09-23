const mysql = require('mysql')
const sd = require('silly-datetime')
const xmlParse=require('xml2js').parseString;
const common=require('../common');
//链接数据库
const connection = require('../../session_mysql.js').connection
let Focus = (req, res) => {
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    var data='';
    req.on('data',(chunk)=>{
        data+=chunk;
    });
    req.on('end',()=>{
        xmlParse(data,(err,result10)=>{
            let {ToUserName='',FromUserName='',CreateTime='',MsgType='',Event='',EventKey='',Ticket=''} = result10.xml
            console.log(ToUserName,FromUserName,CreateTime,MsgType,Event,EventKey,Ticket,'TicketTicketTicketTicketv')
            if(MsgType == 'event'){
                if(Event == 'subscribe'){
                    let sql = `select * from user_info where openid='${FromUserName}' and isdelete=0`
                    connection.query(sql, function (err, result) {
                        if (err) {
                            return res.send('[SELECT ERROR] - ' + err.message);
                        }
                        if(result.length>0){
                            let sql1 = `update user_info set updatetime='${time}' where openid='${FromUserName}'`
                            connection.query(sql1, function (err, result1) {
                                if (err) {
                                    return res.send('[SELECT ERROR] - ' + err.message);
                                }
                                if(result1.message){
                                    common.requestMsg('感谢爱健康的您关注我们营养美味调糖餐，私人定制，配送到家，<a href="http://bjyyq.zhaoshuikan.com.cn/WeChat/#/bjyyq/mine">点击注册</a>，上传您的体检数据，一键开启健康之旅',res,result10);
                                }
                            })
                        }else{
                            let sql2 = `insert into user_info(username, password, createtime, updatetime, isdelete, remark1, remark2, openid, phonenum, remark3, remark4, remark5, remark6,img,name) VALUES (NULL, NULL, '${time}', '${time}', '0', NULL, NULL, '${FromUserName}', NULL, NULL, NULL, NULL, NULL,NULL,NULL)`
                            connection.query(sql2, function (err, result2) {
                                if (err) {
                                    return res.send('[SELECT ERROR] - ' + err.message);
                                }
                                if(result2.serverStatus == 2){
                                    // result2.insertId
                                    let duserid = ''
                                    let cuserid = result2.insertId
                                    if(EventKey==''){
                                        duserid = result2.insertId
                                    }else{
                                        duserid = EventKey[0].split('_')[1]
                                    }
                                            
                                    if(duserid!=''){
                                        let sql7 = `select * from sysparam where paramname='callIntegral' and isdelete=0`
                                        connection.query(sql7, function (err, result7) {
                                            if (err) {
                                                return res.send('[SELECT ERROR] - ' + err.message);
                                            }
                                            let sql6 = `select * from user_info where id='${cuserid}'`
                                            connection.query(sql6, function (err, result6) {
                                                if (err) {
                                                    return res.send('[SELECT ERROR] - ' + err.message);
                                                }
                                                let userInfo = result6[0]
                                                let sql1 = `update user_info set mycent='${Number(userInfo.mycent)+Number(result7[0].paramvalue)}',updatetime='${time}' where id='${cuserid}'`
                                                connection.query(sql1, function (err, result1) {
                                                    if (err) {
                                                        return res.send('[SELECT ERROR] - ' + err.message);
                                                    }
                                                    if(result1.message){
                                                        let sql7 = `select * from sysparam where paramname='新人券' and isdelete=0`
                                                        connection.query(sql7, function (err, result7) {
                                                            if (err) {
                                                                return res.send('[SELECT ERROR] - ' + err.message);
                                                            }
                                                            let sqlcoupon = `select * from coupon_info where id='${result7[0].paramvalue}' and isdelete=0`
                                                            connection.query(sqlcoupon, function (err, resultcoupon) {
                                                                if (err) {
                                                                    return res.send('[SELECT ERROR] - ' + err.message);
                                                                } 
                                                                function afterToday(n){
                                                                    var endTimes = Date.now() + n*24*60*60*1000;
                                                                    var endDate = new Date(endTimes);
                                                                    return endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
                                                                }
                                                                
                                                                let expiredate = afterToday(resultcoupon[0].operid)
                                                                let sql2 = `insert into user_coupon_info(userid, couponid, createtime, updatetime, isdelete, remark1, remark2, expiredate,orderid,status,coupontype) VALUES ('${cuserid}', '${resultcoupon[0].id}', '${time}', '${time}', '0', NULL, NULL, '${expiredate}',NUll,0,0)`
                                                                connection.query(sql2, function (err, result2) {
                                                                    if (err) {
                                                                        return res.send('[SELECT ERROR] - ' + err.message);
                                                                    }
                                                                    if(result2.serverStatus == 2){
                                                                        if(cuserid == duserid){
                                                                            common.requestMsg('感谢爱健康的您关注我们营养美味调糖餐，私人定制，配送到家，<a href="http://bjyyq.zhaoshuikan.com.cn/WeChat/#/bjyyq/mine">点击注册</a>，上传您的体检数据，一键开启健康之旅',res,result10);
                                                                        }else{
                                                                            let sql3 = `insert into bd_info(duserid, cuserid, createtime, updatetime, remark1, remark2, isdelete, cent) VALUES ('${duserid}','${cuserid}','${time}', '${time}',NULL,NULL,0,10)`
                                                                            connection.query(sql3, function (err, result3) {
                                                                                if (err) {
                                                                                    return res.send('[SELECT ERROR] - ' + err.message);
                                                                                }
                                                                                if(result3.serverStatus == 2){
                                                                                    common.requestMsg('感谢爱健康的您关注我们营养美味调糖餐，私人定制，配送到家，<a href="http://bjyyq.zhaoshuikan.com.cn/WeChat/#/bjyyq/mine">点击注册</a>，上传您的体检数据，一键开启健康之旅',res,result10);
                                                                                }
                                                                            })
                                                                        }
                                                                        
                                                                    }
                                                                })
                                                            })
                                                            
                                                        })
                                                    }
                                                })
                                            })
                                            
                                        })
                                        
                                        
                                    }else{
                                        common.requestMsg('感谢爱健康的您关注我们营养美味调糖餐，私人定制，配送到家，<a href="http://bjyyq.zhaoshuikan.com.cn/WeChat/#/bjyyq/mine">点击注册</a>，上传您的体检数据，一键开启健康之旅',res,result10);
                                    }
                                }
                            })
                        }
                    })
                }else{
                    res.send('')  
                }
            }else{
                res.send('')  
            }
        })
    })
}
module.exports = Focus