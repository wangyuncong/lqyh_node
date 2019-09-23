const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let data = {
        pageData: {
            total: 0,
            pageIndex: req.query.pageIndex,
            pageSize: 10
        },
        data: []
    }
    let pageIndex = (req.query.pageIndex - 1) * 10 || 0
    let { userid, username, status } = JSON.parse(req.query.filter)
    // let statusValue = ''
    let sql = ''
    if (username == '' && userid != '') {
        if (status == true) {
            sql = `select * from order_info a, order_action_info c where a.status=1 and a.startdate!='null' and a.id=c.orderid and c.actionseq='2' and a.userid='${userid}' and a.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a, order_action_info c where a.status=1 and a.startdate!='null' and a.id=c.orderid and c.actionseq='2' and a.userid='${userid}' and a.isdelete=0`
        } else {
            sql = `select * from order_info a, order_action_info c where a.status=2 and a.startdate!='null' and a.id=c.orderid and c.actionseq='1' and a.userid='${userid}' and a.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a, order_action_info c where a.status=2 and a.startdate!='null' and a.id=c.orderid and c.actionseq='1' and a.userid='${userid}' and a.isdelete=0`
        }
    } else if (username != '' && userid != '') {
        if (status == true) {
            sql = `select * from order_info a,user_basic_info b, order_action_info c where a.status=1 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='2' and a.userid='${userid}' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a,user_basic_info b, order_action_info c where a.status=1 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='2' and a.userid='${userid}' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0`
        } else {
            sql = `select * from order_info a,user_basic_info b, order_action_info c where a.status=2 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='1' and a.userid='${userid}' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a,user_basic_info b, order_action_info c where a.status=2 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='1' and a.userid='${userid}' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0`
        }
    } else if (username == '' && userid == '') {
        if (status == true) {
            sql = `select * from order_info a, order_action_info c where a.status=1 and a.startdate!='null' and a.id=c.orderid and c.actionseq='2' and a.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a, order_action_info c where a.status=1 and a.startdate!='null' and a.id=c.orderid and c.actionseq='2' and a.isdelete=0`
        } else {
            sql = `select * from order_info a, order_action_info c where a.status=2 and a.startdate!='null' and a.id=c.orderid and c.actionseq='1' and a.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a, order_action_info c where a.status=2 and a.startdate!='null' and a.id=c.orderid and c.actionseq='1' and a.isdelete=0`
        }
    } else if (username != '' && userid == '') {
        if (status == true) {
            sql = `select * from order_info a,user_basic_info b, order_action_info c where a.status=1 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='2' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a,user_basic_info b, order_action_info c where a.status=1 and a.startdate!='null' and a.userid=b.userid and a.id=c.orderid and c.actionseq='2' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0`
        } else {
            sql = `select * from order_info a,user_basic_info b, order_action_info c where a.status=2 and a.startdate!='null' and a.userid=b.id and a.id=c.orderid and c.actionseq='1' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0 order by a.updatetime desc limit ${pageIndex}, 10`
            sql1 = `select count(*) from order_info a,user_basic_info b, order_action_info c where a.status=2 and a.startdate!='null' and a.userid=b.id and a.id=c.orderid and c.actionseq='1' and b.datavalue like '%${username}%' and b.dataname='name' and b.type='1' and a.isdelete=0 and b.isdelete=0`
        }
    }

    console.log(sql, sql1, 'sqllll')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        // let sql1 = `select count(*) from order_info a,user_info b where a.userid=b.id and a.userid='${userid}' and b.name='${username}' and a.isdelete=0 and b.isdelete=0 limit ${pageIndex}, 10`
        connection.query(sql1, function (err, result1) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            let arr = []
            result.map((item) => {
                arr.push(item.userid)
            })
            arr = Array.from(new Set(arr))
            // console.log(arr,'sss')
            let sql2 = `select * from user_basic_info where isdelete=0 and type='1' and userid in (${arr.join(',')})`
            // console.log(sql2,sql1,'ssss')
            connection.query(sql2, function (err, result2) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                let arr1 = []
                result2.map((item2) => {
                    let obj = {}
                    if (item2.dataname == 'name') {
                        obj[item2.dataname] = item2.datavalue
                        obj.userid = item2.userid
                    }
                    arr1.push(obj)
                })
                result.map((item) => {
                    arr1.map((item3) => {
                        if (item.userid == item3.userid) {
                            item.userinfoObj = item3
                        }
                    })
                })

                let arrorderids = []
                result.map((item) => {
                    arrorderids.push(item.orderid)
                })
                arrorderids = Array.from(new Set(arrorderids))
                let slq3 = `select a.*,b.foodname as foodname from order_info_detail a, food_info b where a.isdelete=0 and b.isdelete=0 and a.goodid=b.id and orderid in (${arrorderids})`
                connection.query(slq3, function (err, result3) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    result.map((item) => {
                        result3.map((item3) => {
                            if (item.orderid == item3.orderid) {
                                item.foodInfo = item3
                            }
                        })
                    })
                    data.pageData.total = result1[0]['count(*)']
                    data.data = result
                    returnContent.status = 'success'
                    returnContent.data = data
                    res.send(returnContent);
                })
                
            })

        })

    })
}
module.exports = cateGoryList