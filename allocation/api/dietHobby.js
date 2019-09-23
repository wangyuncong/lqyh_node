const mysql = require('mysql')
const unity = require('./unity')
//链接数据库
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    let { userid = '' } = req.body
    // 拿到用户所有的数据
    const like = query(unity.sqlQuery('sysparam', { paramname: 'like' }))
    const dislike = query(unity.sqlQuery('sysparam', { paramname: 'dislike' }))
    var rows = {}
    var queryList = []
    var list = ['like', 'dislike', 'likeElse', 'dislikeElse']
    // 查询已经选择的内容
    list.forEach(s => {
        let item = query(unity.sqlQuery('user_basic_info', { dataname: s, userid }))
        queryList.push(item)
    })
    await Promise.all([...queryList]).then(s => {
        rows.queryList = s
    })
    await Promise.all([like, dislike]).then(s => {
        rows.like = s[0]
        rows.dislike = s[1]
    })
    res.send({
        status: 0,
        data: rows
    })
}
module.exports = addressList