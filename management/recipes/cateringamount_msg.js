const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    //根据开始日期和结束日期获取所有日期的方法
    function getItemDayDate(day1, day2) {
        var getDate = function (str) {
            var tempDate = new Date();
            var list = str.split("-");
            tempDate.setFullYear(list[0]);
            tempDate.setMonth(list[1] - 1);
            tempDate.setDate(list[2]);
            return tempDate;
        }
        var date1 = getDate(day1);
        var date2 = getDate(day2);
        if (date1 > date2) {
            var tempDate = date1;
            date1 = date2;
            date2 = tempDate;
        }
        date1.setDate(date1.getDate() + 1);
        var dateArr = [];
        var i = 0;
        while (!(date1.getFullYear() == date2.getFullYear()
            && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
                .getDate())) {
            var dayStr = date1.getDate().toString();
            if (dayStr.length == 1) {
                dayStr = "0" + dayStr;
            }
            let monthStr = (date1.getMonth() + 1).toString()
            if(monthStr.length == 1){
                monthStr = "0" + monthStr;
            }
            dateArr[i] = "'"+date1.getFullYear() + "-" + monthStr + "-"
                + dayStr+"'";
            i++;
            date1.setDate(date1.getDate() + 1);
        }
        dateArr.splice(0, 0, "'"+day1+"'")
        dateArr.push("'"+day2+"'");
        return dateArr;
    }
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid || ''
    let type = req.query.type || 'dietitianid'
    let startdate = req.query.startdate || ''
    let enddate = req.query.enddate || ''
    let getType = req.query.getType || ''
    let allDate = []
    if(getType != 'all'){
        allDate = getItemDayDate(startdate,enddate)
    }
    
    console.log(allDate,startdate,enddate,'allDate')
    let sql = ''
    if (type == 'dietitianid') {
        if(getType == 'all'){
            sql = `select * from order_deal_info where isdelete=0 and dietitianid='${userid}' and status in (1,2)`
        }else{
            sql = `select * from order_deal_info where isdelete=0 and dietitianid='${userid}' and orderdate in (${allDate.join(',')}) and status in (1,2)`
        }
        
    } else {
        if(getType == 'all'){
            sql = `select * from order_deal_info where isdelete=0 and kitchenerid='${userid}' and status=2`
        }else{
            sql = `select * from order_deal_info where isdelete=0 and kitchenerid='${userid}' and orderdate in (${allDate.join(',')}) and status=2`
        }
        
    }
    console.log(sql,'pppllll')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }

        returnContent.status = 'success'
        returnContent.data = result
        res.send(returnContent)
    })
}
module.exports = cateGoryList