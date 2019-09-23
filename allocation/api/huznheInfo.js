const fs = require('fs')
const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let huznheInfo = async (req, res) => {
    try {
        let { userid = '' } = req.body
        let sqy = await query(unity.sqlQuery('bd_info', {
            duserid: userid,
            isdelete: 0
        }))
        var all = []
        sqy.forEach(s => {
            let item = query(unity.sqlQuery('user_info', { id: s.cuserid }))
            all.push(item)
        })
        await Promise.all([...all]).then(s => {
            s.forEach((v, i) => {
                sqy[i].msg = v[0]
            })
        })
        res.send({
            data: sqy,
            status: 200
        })
    } catch (error) {

    }
}
module.exports = huznheInfo