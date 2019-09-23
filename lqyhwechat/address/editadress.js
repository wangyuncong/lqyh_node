const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let editAddress = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    // console.log(req.query,'queryqueryqueryqueryqueryqueryquery')
    let id = req.query.id
    let userid = req.query.userid
    let custname = req.query.custname
    let addrinfo = req.query.addrinfo
    let area = req.query.area
    let phonenum = req.query.phonenum
    let isdefault = req.query.isdefault
    let type = req.query.type

    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    // console.log(req.query, time)
    if (type == 'delete') {
        let sql1 = `update addr_info set isdelete='${1}' where id=${id}`
        connection.query(sql1, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if (result.message) {
                returnContent.status = 'success'
            }
            res.send(returnContent)
        })
    } else {
        let sql1 = `update addr_info set isdefault='${0}' where userid=${userid}`
        connection.query(sql1, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if (result.message) {
                // returnContent.status = 'success'
            }
            // res.send(returnContent)
        })
        if (id) {
            let sql = `update addr_info set custname='${custname}', addrinfo='${addrinfo}', area='${area}', phonenum='${phonenum}',isdefault='${isdefault}',updatetime='${time}' where id=${id}`
            // console.log(sql, 'ppp')
            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if (result.message) {
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        } else {

            let sql = `insert into addr_info(custname, addrinfo,area,phonenum,isdefault,userid, createtime, updatetime,isdelete) values ('${custname}', '${addrinfo}', '${area}', '${phonenum}', '${isdefault}','${userid}','${time}','${time}',0)`

            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if (result.serverStatus == 2) {
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        }
    }

}
module.exports = editAddress