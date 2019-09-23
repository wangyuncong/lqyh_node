const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '', riqiList = [], id } = req.body
        var list = []
        riqiList.forEach(element => {
            var sqlData = {
                userid,
                valuetime: element
            }
            id ? sqlData.indicatorid = id : ''
            list.push(query(unity.sqlQuery('medical_indicator_value', sqlData)))
        });
        var data = []
        await Promise.all(list).then(s => {
            s.map(v => {
                if(v){
                    data.push(...v)
                }
            })
        })
        res.send({
            status: 0,
            data
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList