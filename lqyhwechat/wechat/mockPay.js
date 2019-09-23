const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }

    let userid = req.query.userid
    let actionname = '支付完成'
    let actiondesc = '支付完成'
    let actionseq = 2
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let str = ''
    let orderid = req.query.orderid
    let amount = 1000
    console.log('00000mockPay')
    orderid.split(',').map((item, index) => {
        if (index == 0) {
            str += ` ('${userid}', '${actionname}', '${time}', '${time}', '0', NULL, NULL,'${actiondesc}',NULL,NULL,'${actionseq}','${item}')`
        } else {
            str += `,('${userid}', '${actionname}', '${time}', '${time}', '0', NULL, NULL,'${actiondesc}',NULL,NULL,'${actionseq}','${item}')`
        }
    })
    let sql1 = `update order_info set status=1,updatetime='${time}' where id='${orderid}'`
    console.log(sql1)
    connection.query(sql1, function (err, result1) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result1.message) {
            let sql = `insert into order_action_info(userid, actionname, createtime, updatetime, isdelete, remark1, remark2,actiondesc,remark3,remark4,actionseq,orderid) values ${str}`
            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if (result.serverStatus == 2) {
                    // returnContent.status = 'success'
                    // res.send(returnContent)
                    // let sql2 = `update order_pay_info set payremark='${JSON.stringify(jsonData)}',updatetime='${time}',paytime='${jsonData.time_end}',payserial='${jsonData.payserial}',status='0',amount='${jsonData.total_fee}' where orderid = '${JSON.parse(jsonData.attach).orderid}'`
                    // connection.query(sql2, function (err, result2) {
                    //     if (err) {
                    //         return res.end('[SELECT ERROR] - ' + err.message);
                    //     }
                    let sql3 = `select * from bd_info where cuserid='${userid}'`
                    connection.query(sql3, function (err, result3) {
                        if (err) {
                            return res.send('[SELECT ERROR] - ' + err.message);
                        }
                        if (result3.length > 0) {
                            let bdObj = result3[0]
                            let sql4 = `select * from user_info a,role_info b where a.id='${bdObj.duserid}' and a.isdelete=0 and b.isdelete=0 and b.id=a.roleid`
                            connection.query(sql4, function (err, result4) {
                                if (err) {
                                    return res.send('[SELECT ERROR] - ' + err.message);
                                }
                                console.log(result4[0], 'pppsssss////')
                                if (result4.length > 0) {
                                    let userInfoObj = result4[0]
                                    if (userInfoObj.rolename == '客户经理' || userInfoObj.rolename == '营养师' || userInfoObj.rolename == '医生' || userInfoObj.rolename == '其他营养师') {
                                        let sql5 = `update user_info set zjcent='${Number(userInfoObj.zjcent) + Number(amount)}' where id='${bdObj.duserid}'`
                                        connection.query(sql5, function (err, result5) {
                                            if (err) {
                                                return res.end('[SELECT ERROR] - ' + err.message);
                                            }
                                            if (result5.message) {
                                                let sql6 = `insert into cm_detail_info(orderid, doctorid, userid, amount, type, isdelete, createtime,updatetime,remark1,remark2) values ('${orderid}','${bdObj.duserid}','${userid}','${amount}',0,0,'${time}','${time}',NULL,NUll)`
                                                connection.query(sql6, function (err, result6) {
                                                    if (err) {
                                                        return res.end('[SELECT ERROR] - ' + err.message);
                                                    }
                                                    if (result6.serverStatus == 2) {
                                                        let sql3two = `select * from bd_info where cuserid='${bdObj.duserid}'`
                                                        console.log(sql3two,'sql3two')
                                                        connection.query(sql3two, function (err, result3two) {
                                                            if (err) {
                                                                return res.send('[SELECT ERROR] - ' + err.message);
                                                            }
                                                            console.log(result3two,'result3two')
                                                            if (result3two.length > 0) {
                                                                let bdObjTwo = result3two[0]
                                                                let sql4two = `select * from user_info a,role_info b where a.id='${bdObjTwo.duserid}' and a.isdelete=0 and b.isdelete=0 and b.id=a.roleid`
                                                                connection.query(sql4two, function (err, result4two) {
                                                                    if (err) {
                                                                        return res.send('[SELECT ERROR] - ' + err.message);
                                                                    }
                                                                    if (result4two.length > 0) {
                                                                        let userInfoObj = result4two[0]
                                                                        console.log(userInfoObj,'result5userInfoObj')
                                                                        if (userInfoObj.rolename == '客户经理' || userInfoObj.rolename == '营养师' || userInfoObj.rolename == '医生'  || userInfoObj.rolename == '其他营养师') {
                                                                            let sql5 = `update user_info set jjcent='${Number(userInfoObj.jjcent) + Number(amount)}' where id='${bdObjTwo.duserid}'`
                                                                            connection.query(sql5, function (err, result5) {
                                                                                if (err) {
                                                                                    return res.end('[SELECT ERROR] - ' + err.message);
                                                                                }
                                                                                console.log(result5,'result5')
                                                                                if (result5.message) {
                                                                                    let sql6 = `insert into cm_detail_info(orderid, doctorid, userid, amount, type, isdelete, createtime,updatetime,remark1,remark2) values ('${orderid}','${bdObjTwo.duserid}','${userid}','${amount}',1,0,'${time}','${time}',NULL,NULL)`
                                                                                    console.log(sql6,'sql6')
                                                                                    connection.query(sql6, function (err, result6) {
                                                                                        if (err) {
                                                                                            return res.end('[SELECT ERROR] - ' + err.message);
                                                                                        }
                                                                                        console.log(result6,'result6')
                                                                                        if (result6.serverStatus == 2) {
                                                                                            returnContent.status = 'success'
                                                                                            res.send(returnContent)
                                                                                        }
                                                                                    })

                                                                                }
                                                                            })
                                                                        } else {
                                                                            returnContent.status = 'success'
                                                                            res.send(returnContent)
                                                                        }
                                                                    } else {
                                                                        returnContent.status = 'success'
                                                                        res.send(returnContent)
                                                                    }
                                                                })
                                                            } else {
                                                                returnContent.status = 'success'
                                                                res.send(returnContent)
                                                            }

                                                        })
                                                        // returnContent.status = 'success'
                                                        // res.send(returnContent)
                                                    }
                                                })

                                            }
                                        })
                                    }
                                    // else if (userInfoObj.rolename == '医生') {
                                    //     let sql7 = `select * from sysparam where paramname='医生直接提成比例' and isdelete=0`
                                    //     connection.query(sql7, function (err, result7) {
                                    //         if (err) {
                                    //             return res.send('[SELECT ERROR] - ' + err.message);
                                    //         }
                                    //         let sql9 = `update user_info set zjcent='${Number(userInfoObj.zjcent) + Number(amount * (result7[0].paramvalue) * 0.01)}' where id='${bdObj.duserid}'`
                                    //         connection.query(sql9, function (err, result9) {
                                    //             if (err) {
                                    //                 return res.end('[SELECT ERROR] - ' + err.message);
                                    //             }
                                    //             if (result9.message) {
                                    //                 let sql8 = `insert into user_cent_detail(type, operdesc, createtime, updatetime, isdelete, remark1,remark2,centamount,userid,centsource) values (0,'订单支付','${time}','${time}',0,NULL,NUll,'${amount * (result7[0].paramvalue) * 0.01}','${bdObj.duserid}',NULL)`
                                    //                 connection.query(sql8, function (err, result6) {
                                    //                     if (err) {
                                    //                         return res.end('[SELECT ERROR] - ' + err.message);
                                    //                     }
                                    //                     if (result6.serverStatus == 2) {
                                    //                         let sql3two = `select * from bd_info where cuserid='${bdObj.duserid}'`
                                    //                         connection.query(sql3two, function (err, result3two) {
                                    //                             if (err) {
                                    //                                 return res.send('[SELECT ERROR] - ' + err.message);
                                    //                             }
                                    //                             if (result3two.length > 0) {
                                    //                                 let bdObjTwo = result3two[0]
                                    //                                 let sql4two = `select * from user_info a,role_info b where a.id='${bdObjTwo.duserid}' and a.isdelete=0 and b.isdelete=0 and b.id=a.roleid`
                                    //                                 connection.query(sql4two, function (err, result4two) {
                                    //                                     if (err) {
                                    //                                         return res.send('[SELECT ERROR] - ' + err.message);
                                    //                                     }
                                    //                                     if (result4two.length > 0) {
                                    //                                         let userInfoObj = result4two[0]
                                    //                                         if (userInfoObj.rolename == '客户经理') {
                                    //                                             let sql5 = `update user_info set jjcent='${Number(userInfoObj.jjcent) + Number(amount)}' where id='${bdObjTwo.duserid}'`
                                    //                                             connection.query(sql5, function (err, result5) {
                                    //                                                 if (err) {
                                    //                                                     return res.end('[SELECT ERROR] - ' + err.message);
                                    //                                                 }
                                    //                                                 if (result5.message) {
                                    //                                                     let sql6 = `insert into cm_detail_info(orderid, doctorid, userid, amount, type, isdelete, createtime,updatetime,remark1,remark2) values ('${orderid}','${bdObjTwo.duserid}','${bdObj.duserid}','${amount}',1,'${time}','${time}',NULL,NULL)`
                                    //                                                     connection.query(sql6, function (err, result6) {
                                    //                                                         if (err) {
                                    //                                                             return res.end('[SELECT ERROR] - ' + err.message);
                                    //                                                         }
                                    //                                                         if (result6.serverStatus == 2) {
                                    //                                                             returnContent.status = 'success'
                                    //                                                             res.send(returnContent)
                                    //                                                         }
                                    //                                                     })

                                    //                                                 }
                                    //                                             })
                                    //                                         } else {
                                    //                                             returnContent.status = 'success'
                                    //                                             res.send(returnContent)
                                    //                                         }
                                    //                                     } else {
                                    //                                         returnContent.status = 'success'
                                    //                                         res.send(returnContent)
                                    //                                     }
                                    //                                 })
                                    //                             } else {
                                    //                                 returnContent.status = 'success'
                                    //                                 res.send(returnContent)
                                    //                             }

                                    //                         })
                                    //                         // returnContent.status = 'success'
                                    //                         // res.send(returnContent)

                                    //                     }
                                    //                 })
                                    //             }
                                    //         })
                                    //     })
                                    // } 
                                    else {
                                        // console.log(bdObj, 'bdObj')
                                        let sqlinfo = `select * from user_info where id='${bdObj.duserid}'`
                                        connection.query(sqlinfo, function (err, resultInfo) {
                                            if (err) {
                                                return res.send('[SELECT ERROR] - ' + err.message);
                                            }
                                            // if(){

                                            // }else{
                                                
                                            // }
                                            let userInfo = resultInfo[0]
                                            if(resultInfo.length>0){
                                                let sql7 = `select * from sysparam where paramname='客户推广客户直接积分比例' and isdelete=0`
                                                console.log(sql7, 'sql7777')
                                                connection.query(sql7, function (err, result7) {
                                                    if (err) {
                                                        return res.send('[SELECT ERROR] - ' + err.message);
                                                    }
                                                    console.log(result7, userInfo, amount, result7[0].paramvalue, 'sysparam')
                                                    let sql9 = `update user_info set mycent='${Number(userInfo.mycent) + Number(amount * (result7[0].paramvalue) * 0.01)}' where id='${bdObj.duserid}'`
                                                    connection.query(sql9, function (err, result9) {
                                                        if (err) {
                                                            return res.end('[SELECT ERROR] - ' + err.message);
                                                        }
                                                        if (result9.message) {
                                                            let sql8 = `insert into user_cent_detail(type, operdesc, createtime, updatetime, isdelete, remark1,remark2,centamount,userid,centsource) values (0,'订单支付','${time}','${time}',0,NULL,NUll,'${amount * (result7[0].paramvalue) * 0.01}','${userInfo.id}',NULL)`
                                                            connection.query(sql8, function (err, result8) {
                                                                if (err) {
                                                                    return res.end('[SELECT ERROR] - ' + err.message);
                                                                }
                                                                if (result8.serverStatus == 2) {
                                                                    let sql3two = `select * from bd_info where cuserid='${bdObj.duserid}'`
                                                                    connection.query(sql3two, function (err, result3two) {
                                                                        if (err) {
                                                                            return res.send('[SELECT ERROR] - ' + err.message);
                                                                        }
                                                                        if (result3two.length > 0) {
                                                                            let bdObjTwo = result3two[0]
                                                                            let sql4two = `select * from user_info a,role_info b where a.id='${bdObjTwo.duserid}' and a.isdelete=0 and b.isdelete=0 and b.id=a.roleid`
                                                                            connection.query(sql4two, function (err, result4two) {
                                                                                if (err) {
                                                                                    return res.send('[SELECT ERROR] - ' + err.message);
                                                                                }
                                                                                if (result4two.length > 0) {
                                                                                    let userInfoObj = result4two[0]
                                                                                    if (userInfoObj.rolename == '客户经理' || userInfoObj.rolename == '医生' || userInfoObj.rolename == '营养师'  || userInfoObj.rolename == '其他营养师') {
                                                                                        let sql5 = `update user_info set jjcent='${Number(userInfoObj.jjcent) + Number(amount)}' where id='${bdObjTwo.duserid}'`
                                                                                        connection.query(sql5, function (err, result5) {
                                                                                            if (err) {
                                                                                                return res.end('[SELECT ERROR] - ' + err.message);
                                                                                            }
                                                                                            if (result5.message) {
                                                                                                let sql6 = `insert into cm_detail_info(orderid, doctorid, userid, amount, type, isdelete, createtime,updatetime,remark1,remark2) values ('${orderid}','${bdObjTwo.duserid}','${userid}','${amount}',1,0,'${time}','${time}',NULL,NULL)`
                                                                                                connection.query(sql6, function (err, result6) {
                                                                                                    if (err) {
                                                                                                        return res.end('[SELECT ERROR] - ' + err.message);
                                                                                                    }
                                                                                                    if (result6.serverStatus == 2) {
                                                                                                        returnContent.status = 'success'
                                                                                                        res.send(returnContent)
                                                                                                    }
                                                                                                })

                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        returnContent.status = 'success'
                                                                                        res.send(returnContent)
                                                                                    }
                                                                                } else {
                                                                                    returnContent.status = 'success'
                                                                                    res.send(returnContent)
                                                                                }
                                                                            })
                                                                        } else {
                                                                            returnContent.status = 'success'
                                                                            res.send(returnContent)
                                                                        }

                                                                    })
                                                                    // returnContent.status = 'success'
                                                                    // res.send(returnContent)
                                                                }
                                                            })
                                                        }
                                                    })
                                                })
                                            }else{
                                                returnContent.status = 'success'
                                                res.send(returnContent)
                                            }
                                            
                                        })
                                    }

                                } else {
                                    console.log(bdObj, 'bdObj')
                                    let sqlinfo = `select * from user_info where id='${bdObj.duserid}'`
                                    connection.query(sqlinfo, function (err, resultInfo) {
                                        if (err) {
                                            return res.send('[SELECT ERROR] - ' + err.message);
                                        }
                                        let userInfo = resultInfo[0]
                                        let sql7 = `select * from sysparam where paramname='客户推广客户直接积分比例' and isdelete=0`
                                        console.log(sql7, 'sql7777')
                                        connection.query(sql7, function (err, result7) {
                                            if (err) {
                                                return res.send('[SELECT ERROR] - ' + err.message);
                                            }
                                            console.log(result7, userInfo, amount, result7[0].paramvalue, 'sysparam')
                                            let sql9 = `update user_info set mycent='${Number(userInfo.mycent) + Number(amount * (result7[0].paramvalue) * 0.01)}' where id='${userInfo.id}'`
                                            connection.query(sql9, function (err, result9) {
                                                if (err) {
                                                    return res.end('[SELECT ERROR] - ' + err.message);
                                                }
                                                if (result9.message) {
                                                    let sql8 = `insert into user_cent_detail(type, operdesc, createtime, updatetime, isdelete, remark1,remark2,centamount,userid,centsource) values (0,'订单支付','${time}','${time}',0,NULL,NUll,'${amount * (result7[0].paramvalue) * 0.01}','${userInfo.id}',NULL)`
                                                    connection.query(sql8, function (err, result8) {
                                                        if (err) {
                                                            return res.end('[SELECT ERROR] - ' + err.message);
                                                        }
                                                        if (result8.serverStatus == 2) {
                                                            let sql3two = `select * from bd_info where cuserid='${userInfo.id}'`
                                                            connection.query(sql3two, function (err, result3two) {
                                                                if (err) {
                                                                    return res.send('[SELECT ERROR] - ' + err.message);
                                                                }
                                                                if (result3two.length > 0) {
                                                                    let bdObjTwo = result3two[0]
                                                                    let sql4two = `select * from user_info a,role_info b where a.id='${bdObjTwo.duserid}' and a.isdelete=0 and b.isdelete=0 and b.id=a.roleid`
                                                                    connection.query(sql4two, function (err, result4two) {
                                                                        if (err) {
                                                                            return res.send('[SELECT ERROR] - ' + err.message);
                                                                        }
                                                                        if (result4two.length > 0) {
                                                                            let userInfoObj = result4two[0]
                                                                            if (userInfoObj.rolename == '客户经理' || userInfoObj.rolename == '医生' || userInfoObj.rolename == '营养师' || userInfoObj.rolename == '其他营养师') {
                                                                                let sql5 = `update user_info set jjcent='${Number(userInfoObj.jjcent) + Number(amount)}' where id='${bdObjTwo.duserid}'`
                                                                                connection.query(sql5, function (err, result5) {
                                                                                    if (err) {
                                                                                        return res.end('[SELECT ERROR] - ' + err.message);
                                                                                    }
                                                                                    if (result5.message) {
                                                                                        let sql6 = `insert into cm_detail_info(orderid, doctorid, userid, amount, type, isdelete, createtime,updatetime,remark1,remark2) values ('${orderid}','${bdObjTwo.duserid}','${userid}','${amount}',1,0,'${time}','${time}',NULL,NULL)`
                                                                                        connection.query(sql6, function (err, result6) {
                                                                                            if (err) {
                                                                                                return res.end('[SELECT ERROR] - ' + err.message);
                                                                                            }
                                                                                            if (result6.serverStatus == 2) {
                                                                                                returnContent.status = 'success'
                                                                                                res.send(returnContent)
                                                                                            }
                                                                                        })

                                                                                    }
                                                                                })
                                                                            } else {
                                                                                returnContent.status = 'success'
                                                                                res.send(returnContent)
                                                                            }
                                                                        } else {
                                                                            returnContent.status = 'success'
                                                                            res.send(returnContent)
                                                                        }
                                                                    })
                                                                } else {
                                                                    returnContent.status = 'success'
                                                                    res.send(returnContent)
                                                                }

                                                            })
                                                            // returnContent.status = 'success'
                                                            // res.send(returnContent)
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })

                                }


                            })
                        } else {
                            returnContent.status = 'success'
                            res.send(returnContent)
                        }

                    })
                    // })
                }
            })
        }
    })
}
module.exports = cateGoryList