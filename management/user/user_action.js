const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let id = req.query.id
    let roleid = req.query.rolename
    let username = req.query.username
    let password = req.query.password
    let type = req.query.type
    let glucometerid = req.query.glucometerid
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    // console.log(roleid,'roleid')
    
    if(id){
        let sql = ''
        if(type == 'setusername'){
            sql = `update user_info set username='${username}', password='${password}', updatetime='${time}' where id=${id}`
        }else if(type == 'setrolename'){
            sql = `update user_info set roleid='${roleid}', updatetime='${time}' where id=${id}`
        }else{
            sql = `update user_info set glucometerid='${glucometerid}', updatetime='${time}' where id=${id}`
        }
        if(type == 'setusername'){
            let sql1 = `select * from user_info where isdelete='0' and username='${username}' and username!='' and username is not null`
            connection.query(sql1, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                // console.log(result,result.length)
                if(result.length > 0){
                    returnContent.status = 'error'
                    returnContent.data = '用户名已存在'
                    res.send(returnContent)
                }else{
                    connection.query(sql, function (err, result) {
                        if (err) {
                            return res.end('[SELECT ERROR] - ' + err.message);
                        }
                        if(result.message){
                            returnContent.status = 'success'
                        }
                        res.send(returnContent)
                    })
                }
            })
        }else if(type == 'setglucometerid'){
            let sql1 = `select * from user_info where isdelete='0' and glucometerid='${glucometerid}' and glucometerid!='' and glucometerid is not null`
            connection.query(sql1, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if(result.length > 0){
                    returnContent.status = 'error'
                    returnContent.data = '此血糖仪已有用户使用'
                    res.send(returnContent)
                }else{
                    connection.query(sql, function (err, result) {
                        if (err) {
                            return res.end('[SELECT ERROR] - ' + err.message);
                        }
                        if(result.message){
                            returnContent.status = 'success'
                        }
                        res.send(returnContent)
                    })
                }
            })
        }else{
            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if(result.message){
                    returnContent.status = 'success'
                }
                res.send(returnContent)
            })
        }
        
        
        // console.log(sql,'sql')
       
    }else{
        
    }
}
module.exports = cateGoryActions