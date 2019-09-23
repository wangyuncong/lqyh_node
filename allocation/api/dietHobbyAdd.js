const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    let se = req.body
    // 拿到用户所有的数据
    var rows = {}
    // 先查看表里面是否存在
    // 新增喜欢和不喜欢的  其他
    var list = ['like', 'dislike', 'likeElse', 'dislikeElse']
    list.forEach(async s => {
        let listLength = await query(unity.sqlQuery('user_basic_info', { userid: se.userid, dataname: s }))
        if (listLength.length == 0) {
            query(unity.sqlAdd('user_basic_info', { dataname: s, datavalue: se[s], userid: se.userid, valuetime: unity.getNowFormatDate() }))
        } else {
            
            query(unity.sqlUpdate('user_basic_info', {
                id: listLength[0].id
            }, {
                datavalue: se[s]
            }))
            // query(unity.sqlAlter('user_basic_info', {
            //     termKey: 'id',
            //     termValue: listLength[0].id,
            //     alterKey: 'datavalue',
            //     alterValue: se[s]
            // }))
        }
    })
    res.send({
        status: 0
    })
}
module.exports = addressList