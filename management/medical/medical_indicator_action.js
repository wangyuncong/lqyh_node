const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let medicalLndicatorActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {id,indicatorname,indicatordesc,unit,indicatorcode='',seqno='',ymax='',ymin=''} = req.query
    // console.log(req.query,'req.query')
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(id){
        let sql = `update medical_indicator_info set seqno='${seqno}', indicatorname='${indicatorname}', indicatordesc='${indicatordesc}',unit='${unit}',indicatorcode='${indicatorcode}', updatetime='${time}',ymax='${ymax}',ymin='${ymin}' where id=${id}`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.message){
                returnContent.status = 'success'
            }
            res.send(returnContent)
        })
    }else{
        let sql = `insert into medical_indicator_info(indicatorname, indicatordesc, createtime, updatetime, isdelete, remark1, remark2,unit,method,indicatorcode,seqno,ymax,ymin) values ('${indicatorname}', '${indicatordesc}', '${time}', '${time}', '0', NULL, NULL,'${unit}',NULL,'${indicatorcode}','${seqno}','${ymax}','${ymin}')`
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result.serverStatus == 2){
                returnContent.status = 'success'
            }
            res.send(returnContent)
        })
    }
}
module.exports = medicalLndicatorActions