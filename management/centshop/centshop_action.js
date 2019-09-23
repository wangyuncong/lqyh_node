const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let type = req.query.type
    let goodid = req.query.goodid //优惠券id
    let goodname = req.query.goodname //优惠券name
    let goodpic = req.query.goodpic //优惠券图片
    let goodcent = req.query.goodcent
    
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    if(id){
        let sql = `update centshop_good_info set goodname='${goodname}',goodpic='${goodpic}', goodcent='${goodcent}', updatetime='${time}' where id=${id}`
        // console.log(sql,'sssss')
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
        function afterToday(n){
            var endTimes = Date.now() + n*24*60*60*1000;
            var endDate = new Date(endTimes);
            return endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
        }
        let expiredate = afterToday(365*10)
        let sql = `insert into centshop_good_info(type, goodid, createtime, updatetime, isdelete, remark1, remark2,expiretime,goodname,goodpic,goodcent) values ('${type}', '${goodid}', '${time}', '${time}', '0', NULL, NULL,'${expiredate}','${goodname}','${goodpic}','${goodcent}')`
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
module.exports = cateGoryActions