const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let infoAdd = async (req, res) => {
    try {
        let { userid } = req.body
        Object.keys(req.body).forEach(async element => {
            if (element == 'userid') {
                return
            }
            let se = await query(unity.sqlQuery('user_basic_info', {
                userid,
                dataname: element,
                isdelete: 'false'
            }))
            if (se.length === 0) {
                query(unity.sqlAdd('user_basic_info', {
                    userid,
                    type: 1,
                    dataname: element,
                    datavalue: typeof req.body[element] == 'object' ? JSON.stringify(req.body[element]) : req.body[element],
                    valuetime: unity.getNowFormatDate()
                }))
            } else {
                query(unity.sqlUpdate('user_basic_info', {
                    userid,
                    dataname: element
                }, {
                    datavalue: typeof req.body[element] == 'object' ? JSON.stringify(req.body[element]) : req.body[element]
                }))
            }
        });
        res.send({ status: 0 })
    } catch (error) {
        console.log(error);

    }
}
module.exports = infoAdd