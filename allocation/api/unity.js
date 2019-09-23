const unity = {
    // 获取当前时间
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var myDate = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        // if (month >= 1 && month <= 9) {
        //     month = "0" + month;
        // }
        // if (strDate >= 0 && strDate <= 9) {
        //     strDate = "0" + strDate;
        // }
        if (myDate >= 0 && myDate <= 9) {
            myDate = "0" + myDate;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            getSeconds = "0" + getSeconds;
        }
        var currentdate = `${year}-${month}-${strDate} ${myDate}:${getMinutes}:${getSeconds}`
        return currentdate;
    },
    // 根据日期获取以后的某天是几号 
    countDate(res, AddDayCount) {
        let dd = new Date()
        if (res) {
            dd = new Date(res)
        }
        //获取AddDayCount天后的日期
        dd.setDate(dd.getDate() + Number(AddDayCount));
        let y = dd.getFullYear();
        //获取当前月份的日期，不足10补0
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1)
        //获取当前几号，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
        let firstDistribution = y + "-" + m + "-" + d
        return firstDistribution
    },
    // 获取当前时间戳
    nowTimestamp(res) {
        return parseInt(new Date().getTime() / 1000);
    },
    dependTimestamp(res) {
        var date = res
        if (!date) {
            return ''
        }
        date = date.substring(0, 19);
        date = date.replace(/-/g, '/');
        var timestamp = new Date(date).getTime();
        return timestamp
    },
    //sql新增
    sqlAdd(name, s) {
        var v = []
        var c = []
        Object.keys(s).forEach(item => {
            v.push(`'${s[item]}'`)
            c.push(item)
        })
        return `INSERT INTO ${name} (${c.toString()}) VALUES (${v.toString()})`
    },
    // sql查询
    sqlQuery(name, s = { isdelete: 0 }, rep) {
        var v = []
        var c = []
        Object.keys(s).forEach(item => {
            if (item === 'isdelete' && s[item] == 'false') {
                return
            }
            v.push(`${s[item]}`)
            c.push(item)
        })
        var value = ''
        v.forEach((item, index) => {
            if (index === 0) {
                value = `${c[index]}="${v[index]}"`
            } else {
                value += `and ${c[index]}="${v[index]}"`
            }
        })
        return `select * from ${name} where ${value}${rep !== false && rep !== undefined ? `order by ${rep.descName} desc` : ''}`
    },
    // 参数1 表名称 参数二 判断的值  参数三 更改的值
    /**
    @param name 表名称 字符串
    @param New 查询值 对象 {查询的key,查询的value}
    @param alter 更改值 对象 {更改的key，更改的value}
    */
    sqlUpdate(name, New = {}, alter = {}) {
        var tak = ''
        var value = ''
        Object.keys(New).forEach((item, index) => {
            if (index === 0) {
                tak = `${item}='${New[item]}'`
            } else {
                tak += `and ${item}='${New[item]}'`
            }
        })
        Object.keys(alter).forEach((item, index) => {
            if (index === 0) {
                value = `${item}='${alter[item]}'`
            } else {
                value += `, ${item}='${alter[item]}'`
            }
        })
        return `UPDATE ${name} SET ${value} WHERE ${tak}`
    },
    sqlAlter(name, { termKey, termValue, alterKey, alterValue }) {
        var value = ''
        if (typeof termKey === 'object') {
            termKey.forEach((item, index) => {
                if (index === 0) {
                    value = `${termKey[index]}="${termValue[index]}"`
                } else {
                    value += `and ${termKey[index]}="${termValue[index]}"`
                }
            })
        } else {
            value = `${termKey} = '${termValue}'`
        }
        var tak = ''

        if (typeof alterKey === 'object') {
            alterKey.forEach((item, index) => {
                if (index === 0) {
                    tak = `${alterKey[index]}="${alterValue[index]}"`
                } else {
                    tak += `, ${alterKey[index]}="${alterValue[index]}"`
                }
            })
        } else {
            tak = `${alterKey} = '${alterValue}'`
        }

        return `UPDATE ${name} SET ${tak} WHERE ${value}`
    }

}
module.exports = unity