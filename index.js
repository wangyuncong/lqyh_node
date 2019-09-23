const express = require('express'), //express 框架 
    crypto = require('crypto'), //引入加密模块
    config = require('./config');//引入配置文件    
const https = require('https')
const socket = require('./allocation/socket')
const schedule = require('node-schedule');
const urlencode = require('urlencode')
var sd = require('silly-datetime');
const mysql = require('mysql')
var bodyParser = require('body-parser')
var xmlparser = require('express-xml-bodyparser')
var session = require('express-session');
//链接数据库
const query = require('./mysql_config')
const unity = require('./allocation/api/unity')

//链接数据库
const connection = require('./session_mysql.js').connection

let rule = new schedule.RecurrenceRule()
global.access_token_pl = ''
rule.minute = [0, 30, 60] //每30分钟执行一次
const scheduleCronstyle = () => {
    schedule.scheduleJob(rule, () => {
        token()
    });
}
function token() {
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`, (res) => {
        res.on('data', (d) => {
            global.access_token_pl = JSON.parse(d).access_token
            console.log(global.access_token_pl, 'global.access_token_pl')
        });
    })
}
token()
scheduleCronstyle();
var app = express();//实例express框架
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: connection,
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.urlencoded({ extended: true, "limit": "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use('/bjyyq/api', require('./allocation'))
//微信公众号开发接入
app.get('/bjyyq/openDev', function (req, res) {
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
        nonce = req.query.nonce,//随机数
        echostr = req.query.echostr;//随机字符串
    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [config.token, timestamp, nonce];
    array.sort(req);
    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密
    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
});

//登录授权接入
app.get('/bjyyq/aouth', function (req, res) {
    if (!req.query.code) {
        let redirect_uri = `http://bjyyq.zhaoshuikan.com.cn/bjyyq/aouth`
        res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${urlencode(redirect_uri)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
        return
    }
    //1.获取code值
    let code = req.query.code
    https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appid}&secret=${config.secret}&code=${code}&grant_type=authorization_code`, (result) => {
        // console.log(result,'result')   
        result.on('data', (data) => {
            // console.log(JSON.parse(data),'data')  
            let { access_token, openid } = JSON.parse(data)
            https.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, (result2) => {
                result2.on('data', (data2) => {
                    // console.log(JSON.parse(data2),'usermessage')
                    res.send(JSON.parse(data2))
                })
            })
        })
    })
})
// 读取系统参数 缓存起来
let sql = `SELECT * FROM sysparam`
connection.query(sql, function (err, result) {
    if (err) {
        return res.end('[SELECT ERROR] - ' + err.message);
    }
    global.sysparam = result
});

//公司介绍
app.get('/bjyyq/api/companyInfo', (req, res) => {
    let sql = `select contentinfo from content_info where contenttype1='公司介绍' and isdelete='0'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        res.send(result);
    });
})
//订餐页面轮播图
app.get('/bjyyq/api/swiper', (req, res) => {
    let sql = `select id,content_info.contentinfo from content_info where contenttype1='商城轮播' and isdelete='0'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        res.send(result);
    });
})
//获取所有商品分类
app.get('/bjyyq/api/category', (req, res) => {
    let sql = `select id,cname,cdesc from food_category where isdelete='0'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        res.send(result);
    });
})
//获取分类下的商品
app.get('/bjyyq/api/categoryFood', (req, res) => {
    let categoryId = JSON.parse(req.query.categoryId).categoryId || 3
    let sql = `select * from food_info a,food_category_relation b where a.id=b.foodid and b.catagoryid=${categoryId} and a.isdelete=0 and b.isdelete=0`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        res.send(result);
    });
})
//获取用户信息
app.get('/bjyyq/api/userInfo', (req, res) => {
    let returnMsg = {
        status: ''
    }
    let openId = req.query.openId || req.query.openid || 'openId'
    let sql = `select * from user_info where openid='${openId}' and isdelete='0'`
    connection.query(sql, async function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if (result.length === 0) {
            let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
            let { img = '', name = '', password = '', username = '' } = req.query
            let sql = `INSERT INTO user_info(username, password, createtime, updatetime, isdelete, remark1, remark2, openid, phonenum, remark3, remark4, remark5, remark6,img,name) VALUES ('${username}', '${password}', '${time}', '${time}', '0', NULL, NULL, '${openId}', NULL, NULL, NULL, NULL, NULL,'${img}','${name}')`
            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                let sql2 = `select * from user_info where openid='${openId}' and isdelete='0'`
                connection.query(sql2, function (err, result) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    res.send(result)
                })
            })
        } else {
            // 每一次进来如果存在name的话 都会重新赋值
            // 存在的话更新数据
            let { img = '', name = '', password = '', username = '' } = req.query
            // 判断确保不是刷新页面调用
            if (name) {
                await query(unity.sqlUpdate('user_info', {
                    openid: openId
                }, {
                    img,
                    name,
                    password,
                    username
                }))
                let sg = await query(unity.sqlQuery('user_info', {
                    openid: openId
                }))
                res.send(sg)
                return
            }
            res.send(result)
        }
    });
})
//获取购物车信息
app.get('/bjyyq/api/shopCart', (req, res) => {
    let userId = req.query.userid || '0'
    let goodid = req.query.goodid
    let sql = ''
    if (goodid) {
        sql = `select * from food_info a,shopping_cart_info b where a.id=b.goodid and b.quantity!=0 and b.userid=${userId} and b.goodid='${goodid}' and a.isdelete=0 and b.isdelete=0`
    } else {
        sql = `select * from food_info a,shopping_cart_info b where a.id=b.goodid and b.quantity!=0 and b.userid=${userId} and b.startdate is null and a.isdelete=0 and b.isdelete=0`
    }
    // let sql = `select * from shopping_cart_info where userid=${userId} and isdelete='0'`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        res.send(result)
    })
})
//修改购物车商品数量
app.get('/bjyyq/api/modifyShopCart', (req, res) => {
    let userId = req.query.userid
    let goodId = req.query.goodId
    let type = req.query.type
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    // let sql = `update  content_info set quantity=,updatetime=${time} where goodid=${goodId}`
    let sql3 = `select goodid from shopping_cart_info where userid=${userId} and isdelete='0'`
    connection.query(sql3, function (err, result3) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }

        let flag = false
        result3.map((item) => {
            if (item.goodid == goodId) {
                flag = true
            }
        })

        if (flag) {
            let sql = `select quantity from shopping_cart_info where userid=${userId} and isdelete='0' and goodid=${goodId}`
            connection.query(sql, function (err, result) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                let num = result[0].quantity
                if (type == 'add') {
                    // console.log('dsadsa')
                    num++
                } else {
                    num--
                }
                let sql2 = `update shopping_cart_info set quantity=${num}, updatetime='${time}' where goodid=${goodId} and userid=${userId}`
                connection.query(sql2, function (err, result1) {
                    if (err) {
                        return res.end('[SELECT ERROR] - ' + err.message);
                    }
                    // console.log(result1.message)
                    if (result1.message) {
                        res.send({
                            status: 'success'
                        })
                    }
                })
            })
        } else {
            let sql = `INSERT INTO shopping_cart_info(userid, goodid, createtime, updatetime, isdelete, remark1, remark2, startdate, enddate, days, quantity) VALUES ('${userId}', '${goodId}', '${time}', '${time}', '0', NULL, NULL, NULL, NULL, NULL,'1')`
            connection.query(sql, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                if (result1.serverStatus == 2) {
                    res.send({
                        status: 'success'
                    })
                }
            })
        }
    })
})

/*
* 公众号
*/
//商品详情
app.get('/bjyyq/api/goodsDetail', require('./lqyhwechat/goods/goodsdetail.js'))
//设置日期
app.get('/bjyyq/api/setShopDate', require('./lqyhwechat/goods/setdate.js'))
//收货地址列表
app.get('/bjyyq/api/addressList', require('./lqyhwechat/address/addresslist.js'))
//编辑地址
app.get('/bjyyq/api/editAdress', require('./lqyhwechat/address/editadress.js'))
//订单操作
app.get('/bjyyq/api/orderAction', require('./lqyhwechat/order/orderaction.js'))
//清空购物车
app.get('/bjyyq/api/cartShopDel', require('./lqyhwechat/cart/cartshop_delete.js'))
//查看是否支付成功
app.get('/bjyyq/api/getPayStatus', require('./lqyhwechat/order/pay_success.js'))
//用户关注/取消关注事件，扫描带参数二维码事件
app.post('/bjyyq/openDev', require('./lqyhwechat/wechat/focus.js'))
//支付
app.get('/bjyyq/pay', require('./lqyhwechat/wechat/pay.js'))
app.post('/bjyyq/payCallback', xmlparser({ trim: false, explicitArray: false }), require('./lqyhwechat/wechat/pay_callback.js'))
//模拟支付
app.get('/bjyyq/mockPay', require('./lqyhwechat/wechat/mockPay.js'))
//获取用户下的优惠券
app.get('/bjyyq/api/userCouponList', require('./lqyhwechat/order/user_coupon_list.js'))
//修改优惠券的状态
app.get('/bjyyq/api/userCouponAction', require('./lqyhwechat/order/user_coupon_action.js'))
//获取血糖值
app.post('/sendbloodsugar',require('./lqyhwechat/medical_value/medical_value_action.js'))


/*
* management(公众号后台管理)
*/

/*
* 登录注册
*/
//注册
app.get('/bjyyq/apimg/registered', require('./management/registered.js'))
//登录
app.get('/bjyyq/apimg/login', require('./management/login.js'))
//修改密码
app.get('/bjyyq/apimg/changePassword', require('./management/changepassword.js'))

/*
*   分类菜单
*/
//分类列表
app.get('/bjyyq/apimg/categoryList', require('./management/category_list.js'))
//添加修改分类
app.get('/bjyyq/apimg/categoryActions', require('./management/category_actions.js'))
//删除分类
app.get('/bjyyq/apimg/categoryDelete', require('./management/category_delete.js'))

/*
*   商品菜单
*/
//商品列表
app.get('/bjyyq/apimg/goodsList', require('./management/goods_list.js'))
//添加修改商品
app.get('/bjyyq/apimg/goodsActions', require('./management/goods_actions.js'))
//删除商品
app.get('/bjyyq/apimg/goodsDelete', require('./management/goods_delete.js'))

/*
*   页面信息菜单
*/
//页面信息列表
app.get('/bjyyq/apimg/pageMessageList', require('./management/pagemessage_list.js'))
//添加修改商品
app.get('/bjyyq/apimg/pageMessageActions', require('./management/pagemessage_actions.js'))
//删除商品
app.get('/bjyyq/apimg/pageMessageDelete', require('./management/pagemessage_delete.js'))

/*
*   页面信息菜单
*/
//优惠券列表
app.get('/bjyyq/apimg/preferentialList', require('./management/preferential_list.js'))
//添加修改优惠券
app.get('/bjyyq/apimg/preferentialActions', require('./management/preferential_actions.js'))
//删除优惠券
app.get('/bjyyq/apimg/preferentialDelete', require('./management/preferential_delete.js'))

/*
*   医学指标
*/
//医学指标列表
app.get('/bjyyq/apimg/medicalIndicatorList', require('./management/medical/medical_indicator_list.js'))
//添加修改医学指标
app.get('/bjyyq/apimg/medicalIndicatorAction', require('./management/medical/medical_indicator_action.js'))
//删除医学指标
app.get('/bjyyq/apimg/medicalIndicatorDelete', require('./management/medical/medical_indicator_delete.js'))

/*
*   积分商城
*/
//积分商城列表
app.get('/bjyyq/apimg/centshopList', require('./management/centshop/centshop_list.js'))
//添加修改积分商城
app.get('/bjyyq/apimg/centshopAction', require('./management/centshop/centshop_action.js'))
//删除积分商城
app.get('/bjyyq/apimg/centshopDelete', require('./management/centshop/centshop_delete.js'))

/*
*   系统参数
*/
//系统参数列表
app.get('/bjyyq/apimg/sysparamList', require('./management/sysparam/sysparam_list.js'))
//添加修改系统参数
app.get('/bjyyq/apimg/sysparamAction', require('./management/sysparam/sysparam_action.js'))
//删除系统参数
app.get('/bjyyq/apimg/sysparamDelete', require('./management/sysparam/sysparam_delete.js'))

/*
*   角色
*/
//角色列表
app.get('/bjyyq/apimg/roleList', require('./management/role/role_list.js'))
//添加修改角色
app.get('/bjyyq/apimg/roleAction', require('./management/role/role_action.js'))
//给角色设置菜单权限
app.get('/bjyyq/apimg/setAuthMenu', require('./management/role/set_auth_menu.js'))
//删除角色
app.get('/bjyyq/apimg/roleDelete', require('./management/role/role_delete.js'))

/*
* 用户管理
*/
//用户列表
app.get('/bjyyq/apimg/userList', require('./management/user/user_list.js'))
//用户赋予角色
app.get('/bjyyq/apimg/userRoleAction', require('./management/user/user_action.js'))
/*
*   菜单
*/
//获取角色菜单
app.get('/bjyyq/apimg/menuList', require('./management/menu_list.js'))

/*
* 订单管理
*/
//订单列表
app.get('/bjyyq/apimg/orderList', require('./management/order/order_list.js'))

/*
*   咨询
*/
//咨询列表
app.get('/bjyyq/apimg/consultingList', require('./management/consulting/communication_list.js'))
//所有营养师列表
app.get('/bjyyq/apimg/dietitianList', require('./management/consulting/dietitian_list.js'))
//咨询列表
app.get('/bjyyq/apimg/consultingAction', require('./management/consulting/communication_action.js'))

/*
* 营养师
*/
//菜谱列表
app.get('/bjyyq/apimg/recipeList', require('./management/recipes/recipes_making_list.js'))
//删除菜谱
app.get('/bjyyq/apimg/deleteRecipe', require('./management/recipes/menu_detail_delete.js'))
//食品大全列表
app.get('/bjyyq/apimg/statementList', require('./management/recipes/statement_list.js'))
//食材列表
app.get('/bjyyq/apimg/recipeListDetail', require('./management/recipes/recipes_making_detail_list.js'))
//保存菜谱
app.post('/bjyyq/apimg/saveRecipes', require('./management/recipes/menu_detail_actions.js'))
//配餐列表
app.get('/bjyyq/apimg/mealList', require('./management/recipes/configuration_meal_list.js'))
//用户基本信息
app.get('/bjyyq/apimg/customerMsg', require('./management/recipes/customer_msg.js'))
//获取每日套餐操作id
app.get('/bjyyq/apimg/ordeDayMsg', require('./management/recipes/order_deal_msg.js'))
//每天菜单操作
app.get('/bjyyq/apimg/orderMenuAction', require('./management/recipes/order_menu_action.js'))
//获取每天的菜单
app.get('/bjyyq/apimg/orderMenuList', require('./management/recipes/order_menu_list.js'))
//删除每天的餐别
app.get('/bjyyq/apimg/deleteOrderMenu', require('./management/recipes/order_menu_delete.js'))
//查看订单菜单的食材
app.get('/bjyyq/apimg/orderRecipeListDetail', require('./management/recipes/order_menu_detail_list.js'))
//保存订单的菜谱
app.post('/bjyyq/apimg/saveOrderRecipes', require('./management/recipes/order_menu_detail_action.js'))
//修改每天订单菜谱状态
app.get('/bjyyq/apimg/dealAction', require('./management/recipes/deal_action.js'))
//修改份数
app.get('/bjyyq/apimg/menuCentAction', require('./management/recipes/menucent_action.js'))
//修改订单状态
app.get('/bjyyq/apimg/orderActionEdit', require('./management/recipes/order_action_edit.js'))
//指标数据
app.get('/bjyyq/apimg/indicatorList', require('./management/recipes/indicator_value_list.js'))
//获取可选择的营养成分
app.get('/bjyyq/apimg/getAllNutrients', require('./management/nutrients/all_nutrients_list.js'))
//更改可查看的营养成分
app.get('/bjyyq/apimg/nutrientsAction', require('./management/nutrients/nutrients_action.js'))
//获取某个营养师能看的营养成分
app.get('/bjyyq/apimg/nutrientsList', require('./management/nutrients/nutrients_list.js'))
//获取历史配餐数和本月配餐数
app.get('/bjyyq/apimg/cateringamountMsg', require('./management/recipes/cateringamount_msg.js'))


/*
*   厨师
*/
app.get('/bjyyq/apimg/getDealList', require('./management/kitchen/deal_list.js'))

/*
*   文件上传
*/
app.post('/bjyyq/apimg/fileupload', require('./management/file_upload.js'))

//监听3000端口
app.listen(3000, () => {
    console.log(3000)
    console.log(unity.getNowFormatDate())
});