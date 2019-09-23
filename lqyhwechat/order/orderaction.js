const mysql = require('mysql')
var sd = require('silly-datetime');
//链接数据库
const connection = require('../../session_mysql.js').connection
let orderAction = (req, res) => {
    let returnContent = {
        status:'error',
        data:null
    }
    let userid = req.query.userid
    let goodid = req.query.goodid
    let addrid = req.query.addrid
    let actionname = req.query.actionname
    let actiondes = req.query.actiondes
    let actionseq = req.query.actionseq
    let area = req.query.area
    let status = req.query.status
    let goodMsg = JSON.parse(req.query.goodMsg)
    let orderid = req.query.orderid
    let amount = req.query.amount
    let realamount = req.query.realamount
    let remark1 = req.query.remark1 || ''
    let type = req.query.type
    function getYearAndMonthAndDay(start,end,callback){
        function gDate(datestr){
          var temp = datestr.split("-");
          var date = new Date(temp[0],temp[1],temp[2]);
          return date;
        }
        var startTime = gDate(start);
        var endTime = gDate(end);
        while((endTime.getTime()-startTime.getTime())>=0){
          var year = startTime.getFullYear();
          var month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth();
          var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
        //   console.log(year+"-"+month+"-"+day);
          callback(year+"-"+month+"-"+day)
          startTime.setDate(startTime.getDate()+1);
        }
    }
    if(orderid){
        
    }else{
        let str = ''
        let arr = []
        let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        if(goodMsg.length>1){
            let money = 0
            goodMsg.map((item,index)=>{
                
                
                // console.log(ordernum)
                // arr.push(ordernum)
                money+=(Number(item.quantity)*Number(item.foodprice))
                // if(index == 0){
                    // str=` ('${userid}', '${addrid}', '${time}', '${time}', '0', NULL, NULL,'${area}',null,null,'${Number(item.quantity)*Number(item.foodprice)}','${status}', '${item.startdate}', '${item.enddate}',0,'${Number(item.quantity)*Number(item.foodprice)}', '${ordernum}')`  
                // }
                // else{
                //     str+=`,('${userid}', '${addrid}', '${time}', '${time}', '0', NULL, NULL,'${area}',null,null,'${Number(item.quantity)*Number(item.foodprice)}','${status}', '${item.startdate}', '${item.enddate}',0,'${Number(item.quantity)*Number(item.foodprice)}', '${ordernum}')`  
                // }
            })
            let ordernum = time.split(' ')[0].replace(/-/g,'') + time.split(' ')[1].replace(/:/g,'') + userid + goodMsg[0].goodid + goodMsg[0].id
            str=` ('${userid}', '${addrid}', '${time}', '${time}', '0', '${remark1}', NULL,'${area}',null,null,'${money}','${status}', NULL, NULL,'${money-realamount}','${realamount}', '${ordernum}')`  
        }else{
            let ordernum = time.split(' ')[0].replace(/-/g,'') + time.split(' ')[1].replace(/:/g,'') + userid + goodMsg[0].goodid + goodMsg[0].id
            str =` ('${userid}', '${addrid}', '${time}', '${time}', '0', '${remark1}', NULL,'${area}',null,null,'${Number(goodMsg[0].quantity)*Number(goodMsg[0].foodprice)}','${status}', '${goodMsg[0].startdate}', '${goodMsg[0].enddate}','${(Number(goodMsg[0].quantity)*Number(goodMsg[0].foodprice))-realamount}','${realamount}', '${ordernum}')`
        }
        
        
        let sql = `INSERT INTO order_info(userid, addrid, createtime, updatetime, isdelete, remark1, remark2,area,distance,counttime,amount,status, startdate, enddate,discount, realamount, ordernumber) VALUES ${str}`
        // console.log(sql)
        connection.query(sql, function (err, result1) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if (result1.serverStatus == 2) {
                
                let arr1 = []
                // arr.map((item,index2)=>{
                    let sql2 = `select * from order_info where isdelete='0' and id=${result1.insertId}`
                    connection.query(sql2, function (err, result2) {
                        if (err) {
                            return res.end('[SELECT ERROR] - ' + err.message);
                        }
                        returnContent.data = result2[0]
                        // console.log(result2,goodMsg,'ppp')
                        arr1 = result2
                        // if(index2 == 0){
                            let str = ''
                            let str1 = ''
                            let str2 = ''
                            arr1.map((item,index)=>{
                                console.log(item,'ppp')
                                let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                if(index == 0){
                                    goodMsg.map((item1,index1)=>{
                                        if(index1 == 0){
                                            str+=` ('${item.id}', '${item1.goodid}', '${time}', '${time}', '0', NULL, NULL,'${item1.quantity}','${item1.foodprice}',null,null)`  
                                        }else{
                                            str+=`,('${item.id}', '${item1.goodid}', '${time}', '${time}', '0', NULL, NULL,'${item1.quantity}','${item1.foodprice}',null,null)`  
                                        }
                                    })
                                    str1+=` ('${userid}', '${actionname}','${time}','${time}','0',null,null,'${actiondes}',null,null,'${actionseq}','${item.id}')`
                                    if(item.startdate!==null && item.startdate!='null'){
                                         
                                        let arr = []
                                        getYearAndMonthAndDay(item.startdate,item.enddate,function(res){
                                            let obj = {}
                                            obj.orderid = item.id
                                            obj.orderdate = res
                                            arr.push(obj)
                                        })
                                        arr.map((item3,index3)=>{
                                            if(index3 == 0){
                                                str2+=` ('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                            }else{
                                                str2+=`,('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                            }
                                            
                                        })
                                    } 
                                }else{
                                    // str+=`,('${item.id}', '${goodMsg[index].goodid}', '${time}', '${time}', '0', NULL, NULL,'${goodMsg[index].quantity}','${goodMsg[index].foodprice}',null,null)`  
                                    // if(item.startdate.includes('-')){
                                    //     if(str1 == ''){
                                    //         str1+=`('${userid}', '${actionname}','${time}','${time}','0',null,null,'${actiondes}',null,null,'${actionseq}','${item.id}')`
                                    //         let arr = []
                                    //         getYearAndMonthAndDay(item.startdate,item.enddate,function(res){
                                    //             let obj = {}
                                    //             obj.orderid = item.id
                                    //             obj.orderdate = res
                                    //             arr.push(obj)
                                    //         })
                                    //         arr.map((item3,index3)=>{
                                    //             if(index3 == 0){
                                    //                 str2+=` ('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                    //             }else{
                                    //                 str2+=`,('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                    //             }
                                    //         })
                                    //     }else{
                                    //         str1+=`,('${userid}', '${actionname}','${time}','${time}','0',null,null,'${actiondes}',null,null,'${actionseq}','${item.id}')`
                                    //         let arr = []
                                    //         getYearAndMonthAndDay(item.startdate,item.enddate,function(res){
                                    //             let obj = {}
                                    //             obj.orderid = item.id
                                    //             obj.orderdate = res
                                    //             arr.push(obj)
                                    //         })
                                    //         arr.map((item3,index3)=>{
                                    //             if(index3 == 0){
                                    //                 str2+=` ('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                    //             }else{
                                    //                 str2+=`,('${item3.orderid}','${item3.orderdate}',0,NULL,NULL,0)`
                                    //             }
                                    //         })
                                    //     }
                                        
                                    // }
                                }
                            })
                            
                            if(type=='taocan'){
                                let sql = `insert into order_info_detail(orderid,goodid,createtime,updatetime,isdelete,remark1,remark2,quantity,goodprice,remark4,remark3) values ${str}`
                                connection.query(sql, function (err, result1) {
                                    if (err) {
                                        return res.end('[SELECT ERROR] - ' + err.message);
                                    }
                                    // console.log(result1,'0000000')
                                })
                                let sql2 = `insert into order_action_info(userid,actionname,createtime,updatetime,isdelete,remark1,remark2,actiondesc,remark3,remark4,actionseq,orderid) values ${str1}`
                                connection.query(sql2, function (err, result1) {
                                    if (err) {
                                        return res.end('[SELECT ERROR] - ' + err.message);
                                    }
                                    // console.log(result1,'resss')
                                })
                                if(str2!==''){
                                    let sql3 = `insert into order_deal_info(orderid,orderdate,status,remark1,remark2,isdelete) values ${str2}`
                                    console.log(sql3,'dasdas')
                                    connection.query(sql3, function (err, result1) {
                                        if (err) {
                                            return res.end('[SELECT ERROR] - ' + err.message);
                                        }
                                        console.log(result1,'sql3sql3')
                                        returnContent.status = 'success'
                                        res.send(returnContent)
                                    })
                                }else{
                                    returnContent.status = 'success'
                                    res.send(returnContent)
                                }
                                
                            }else{
                                let sql2 = `insert into order_action_info(userid,actionname,createtime,updatetime,isdelete,remark1,remark2,actiondesc,remark3,remark4,actionseq,orderid) values ${str1}`
                                connection.query(sql2, function (err, result1) {
                                    if (err) {
                                        return res.end('[SELECT ERROR] - ' + err.message);
                                    }
                                    // console.log(result1,'resss')
                                })
                                let sql = `insert into order_info_detail(orderid,goodid,createtime,updatetime,isdelete,remark1,remark2,quantity,goodprice,remark4,remark3) values ${str}`
                                connection.query(sql, function (err, result1) {
                                    if (err) {
                                        return res.end('[SELECT ERROR] - ' + err.message);
                                    }
                                    returnContent.status = 'success'
                                    res.send(returnContent)
                                    // console.log(result1,'0000000')
                                })
                            }
                            
                        // }
                        
                    // })
                })
                
            }
        })
        
    }
}
module.exports = orderAction