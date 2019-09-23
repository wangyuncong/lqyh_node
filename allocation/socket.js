var ws = require("nodejs-websocket");
//链接数据库
const query = require('../mysql_config')
const unity = require('./api/unity')
let conns = {};
var server = ws.createServer(function (conn) {
    conn.on("text", async function (obj) {
        /** 
         * @param obj JSON字符串 所有数据
         * @param obj.userid 字符串 用户id
         * @param obj.value 字符串 发送的内容
         * @param obj.restUserId 字符串 发送给"对方"的 对方id 
         * @param obj.type ACQUIRE(获取所有) ADD（新增）
         * @param obj.msg JSON字符串 所有数据 会回复给你的数据
         * @param obj.sender 通知人id 通知到谁 谁的id 仅用于通知
         * 
         * */
        try {
            obj = JSON.parse(obj);
            conns[obj.restUserId || obj.userid] = conn;
            switch (obj.type) {
                // 新增
                case 'ADD':
                    let inquire = await query(unity.sqlQuery('communication_info', { userid: obj.userid }))
                    let channelid = ''
                    if (inquire.length !== 0) {
                        channelid = inquire[0].channelid
                    }
                    query(unity.sqlAdd('communication_info', {
                        originatorid: obj.userid,
                        createtime: unity.getNowFormatDate(),
                        content: obj.value,
                        userid: obj.userid,
                        isdelete: 0,
                        readtype: 0,
                        replierid: obj.restUserId || '',
                        channelid,
                    })).then(async s => {
                        let item = await query(unity.sqlQuery('user_info', { id: obj.restUserId || obj.userid }))
                        var sg = {
                            status: 0,
                            userid: obj.userid,
                            msg: obj.msg || {},
                            createtime: unity.getNowFormatDate(),
                            replierid: obj.restUserId,
                            value: obj.value,
                            type: "success"
                        }
                        sg.msg.img = item[0].img
                        sg.msg.name = item[0].name
                        // 判断表里面是否有数据
                        let communication = await query(unity.sqlQuery('communication_dietitian_info', { userid: obj.userid, isdelete: 0, status: 1 }))
                        if (communication.length == 0) {
                            query(unity.sqlAdd('communication_dietitian_info', { userid, status: 1, content: obj.value, replierid: obj.restUserId || obj.sender, isdelete: 0, createtime: unity.getNowFormatDate(), updatetime: unity.getNowFormatDate() }))
                        } else {
                            // 更改最近一条的数据信息
                            query(unity.sqlUpdate('communication_dietitian_info', { userid, status: 1 }, { content: obj.value, replierid: obj.restUserId || obj.sender, updatetime: unity.getNowFormatDate() }))
                        }

                        // 医生
                        if (conns[obj.restUserId]) {
                            query(unity.sqlUpdate('communication_info', { userid, readtype: 0 }, { readtype: 1 }))
                            conns[obj.restUserId].send(JSON.stringify(sg))
                            global.sendAssign(obj, obj.userid, obj.value)
                        } else {
                            conns[obj.userid].send(JSON.stringify(sg))
                            global.sendAssign(obj, obj.sender, obj.value)
                        }
                    })
                    break;
                default:
                    break;
            }
            if (obj.type == 'ACQUIRE') {
                global.sendAssign(obj, obj.restUserId, obj.value)
            }
        } catch (error) {
            console.log(error);
        }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        // console.log("异常关闭")
    });// 服务端广播
    function broadcast(server, msg) {
        server.connections.forEach(function (conn) {
            conn.sendText(msg)
        })
    }

    global.sendAssign = sendAssign
    // 指定人发送
    /**
     * @param sendAssign 指定人发送
     * @param obj 所有数据的
     * @param obj.type 类型  ACQUIRE获取
     * 
     * */
    async function sendAssign(obj, msg, value) {
        // 获取所有的数据
        let = { userid, restUserId, type } = obj
        if (obj.type === 'ACQUIRE') {
            let inquire = await query(unity.sqlQuery('communication_info', { userid }))
            // 处理未受理数据
            if (obj.restUserId) {
                inquire.forEach(s => {
                    query(unity.sqlUpdate('communication_info', { userid, readtype: 0 }, { readtype: 1 }))
                })
            }

            var all = []
            inquire.forEach(s => {
                let item = query(unity.sqlQuery('user_info', { id: s.replierid || userid }))
                all.push(item)
            })
            // 获取公众号人的所有数据
            await Promise.all([...all]).then(s => {
                s.forEach(async (v, i) => {
                    inquire[i].msg = v[0]
                    let realName = await query(unity.sqlQuery('user_basic_info', { userid, dataname: "name" }))
                    if (realName.length != 0) {
                        inquire[i].msg.realName = realName[0].datavalue
                    }
                })
            })
            var data = {
                inquire,
                type: 'ACQUIRE'
            }
            conns[obj.restUserId || userid].send(JSON.stringify(data))
            return
        }
        var msgTonzhi = obj.sender || msg
        if (conns[msgTonzhi]) {
            // ADD为成功
            conns[msgTonzhi].send(JSON.stringify({
                userid,
                createtime: unity.getNowFormatDate(),
                msg: obj.msg || {},
                type: type,
                value: value, replierid: restUserId
            }))
        } else {
            // console.log('找不到');
        }
    }
}).listen(8001)