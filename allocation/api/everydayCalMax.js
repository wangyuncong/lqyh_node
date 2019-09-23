const unity = require('./unity')
const mysql = require('mysql')
const query = require('../../mysql_config')
let addressList = async (req, res) => {
    try {
        let { userid = '' } = req.body
        // 查询血糖限制
        let value = await query(unity.sqlQuery('sysparam', {
            paramname: '血糖',
            isdelete: 0
        }))
        let weight = await query(unity.sqlQuery('user_basic_info', {
            dataname: 'weight',
            userid,
            isdelete: 0
        }))
        // 获取bmi
        let BMI = await query(unity.sqlQuery('user_basic_info', {
            dataname: 'BMI',
            userid,
            isdelete: 0
        }))
        // 获取日期 用来判断怀孕几周
        let gestation = await query(unity.sqlQuery('user_basic_info', {
            dataname: 'gestation',
            userid,
            isdelete: 0
        }))
        var bmiValue = ''
        // BMI
        if (BMI.length != 0) {
            bmiValue = Number(BMI[0].datavalue)
        }
        var gestationValue = ''
        // 怀孕日期
        var diff = ''
        if (gestation.length != 0) {
            gestationValue = gestation[0].datavalue
            var start = new Date(gestationValue.replace("-", "/"));
            var end = new Date(unity.countDate('', 0).replace("-", "/"));
            diff = parseInt((end - start) / (1000 * 60 * 60 * 24));
            diff = parseInt(diff / 7)
        }
        // weight
        var weightValue = ''
        if (weight.length != 0) {
            weightValue = Number(weight[0].datavalue)
        }
        // 计算怀孕
        var tizhon = {}
        // 偏轻
        if (bmiValue < 18.5) {
            tizhon.shang = weightValue + diff * 0.58
            tizhon.xia = weightValue + diff * 0.44
        } else if (bmiValue > 23.9) {
            // 适中
            tizhon.shang = weightValue + diff * 35
            tizhon.xia = weightValue + diff * 0.50
        } else if (bmiValue > 27.9) {
            // 超重
            tizhon.shang = weightValue + diff * 0.23
            tizhon.xia = weightValue + diff * 0.33
        } else if (bmiValue > 28) {
            // 肥胖
            tizhon.shang = weightValue + diff * 0.17
            tizhon.xia = weightValue + diff * 0.27
        }
        res.send({
            status: 0,
            data: {
                tizhon,
                xuetang: value[0]
            }
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = addressList