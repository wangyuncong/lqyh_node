const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', element = [] } = req.body
        var list = []
        if (typeof element === 'string') {
            list.push(query(unity.sqlQuery('user_basic_info', { userid, dataname: element })))
        } else {
            element.forEach(s => {
                list.push(query(unity.sqlQuery('user_basic_info', { userid, dataname: s })))
            });
        }
        await Promise.all(list).then(s => {
            var vlist = []
            s.filter(v => vlist.push(v[0]))
            res.send({
                status: 0,
                data: vlist
            })
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList