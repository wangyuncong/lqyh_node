var sd = require('silly-datetime');
//链接数据库
const connection = require('../../session_mysql.js').connection

let medicalValueAction = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }

    var time_range = function (beginTime, endTime, nowTime) {
        var strb = beginTime.split(":");
        if (strb.length != 2) {
            return false;
        }

        var stre = endTime.split(":");
        if (stre.length != 2) {
            return false;
        }

        var strn = nowTime.split(":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date();
        var e = new Date();
        var n = new Date();

        b.setHours(strb[0]);
        b.setMinutes(strb[1]);
        e.setHours(stre[0]);
        e.setMinutes(stre[1]);
        n.setHours(strn[0]);
        n.setMinutes(strn[1]);
        // console.log(beginTime,endTime,nowTime,n.getTime() - b.getTime(), n.getTime() - e.getTime(),'nowTime')
        if (n.getTime() - b.getTime() >= 0 && n.getTime() - e.getTime() < 0) {
            return true;
        } else {
            // console.log(n.getHours() + ":" + n.getMinutes(),'sdsasdsadas')
            return false;
        }
    }

    let { devicesn, result, unit = '', testtime = '', foodstatus = '', code = '' } = req.body
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    if (testtime == '' || result == '' || devicesn == '') {
        returnContent.status = 2
        returnContent.data = '参数不全'
        res.send(returnContent)
    } else {
        let obj = {}
        let sql = `select * from user_info where glucometerid='${devicesn}'`
        connection.query(sql, function (err, result2) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            
            if(result2.length==0){
                returnContent.status = 1
                returnContent.data = '没有用户绑定此血糖仪'
                res.send(returnContent)
            }else{
                obj.userid = result2[0].id
                let arr = [{
                    id: 1,
                    desc: '早餐前血糖',
                    timeQuantumstart: '05:00',
                    timeQuantumend: '09:00'
                }, {
                    id: 2,
                    desc: '早餐后血糖',
                    timeQuantumstart: '09:00',
                    timeQuantumend: '11:00'
                }, {
                    id: 3,
                    desc: '午餐前血糖',
                    timeQuantumstart: '11:00',
                    timeQuantumend: '13:00'
                }, {
                    id: 4,
                    desc: '午餐后血糖',
                    timeQuantumstart: '13:00',
                    timeQuantumend: '17:00'
                }, {
                    id: 5,
                    desc: '晚餐前血糖',
                    timeQuantumstart: '17:00',
                    timeQuantumend: '19:30'
                }, {
                    id: 6,
                    desc: '晚餐后血糖',
                    timeQuantumstart: '19:30',
                    timeQuantumend: '21:30'
                }, {
                    id: 7,
                    desc: '睡前血糖',
                    timeQuantumstart: '21:30',
                    timeQuantumend: '24:00'
                },{
                    id: 7,
                    desc: '睡前血糖',
                    timeQuantumstart: '00:00',
                    timeQuantumend: '05:00'
                }]
                let temp = false
                let timeVariable = testtime.split(' ')[1]
                arr.map((item)=>{
                    temp = time_range (item.timeQuantumstart, item.timeQuantumend, timeVariable)
                    if(temp){
                        obj.indicatorid = item.id
                    }
                })
                obj.valuetime = testtime.split(' ')[0]
                let sql1 = `insert into medical_indicator_value(indicatorid, indicatorvalue, createtime, updatetime, isdelete, remark1, remark2,unit,method,valuetime,userid) values ('${obj.indicatorid}', '${result}', '${time}', '${time}', '0', NULL, NULL,'${unit}',NULL,'${obj.valuetime}','${obj.userid}')`
                connection.query(sql1, function (err, result1) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    if(result1.serverStatus == 2){
                        returnContent.status = 0
                    }
                    res.send(returnContent)
                })
            } 
        })
    }

}
module.exports = medicalValueAction