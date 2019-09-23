const express = require('express');

const router = new express.Router();
// 微信授权
router.post('/wxconfig',require('./api/wxconfig'))
// 微信二维码生成  type = 1是临时 否则是永久
router.post('/qrcode',require('./api/qrcode'))
// 微信二维码获取
router.post('/querycode',require('./api/querycode'))
// 优惠券
router.post('/discountsList',require('./api/discountsList'))
// 订单列表
router.post('/orderList',require('./api/orderList'))
// 根据订单号查询订单详情
router.post('/orderNumber',require('./api/orderNumber'))
// 订单详情查询餐谱等信息
router.post('/orderdiet',require('./api/orderdiet'))
// 积分兑换
router.post('/integralConversion',require('./api/integralConversion'))
// 积分商城列表
router.post('/integralList',require('./api/integralList'))
// 图片保存 base64
router.post('/imgAdd',require('./api/imgAdd'))
// 个人信息保存
router.post('/infoAdd',require('./api/infoAdd'))
// 饮食偏好
router.post('/dietHobby',require('./api/dietHobby'))
// 饮食偏好
router.post('/dietHobbyAdd',require('./api/dietHobbyAdd'))
// 推广的患者列表
router.post('/huznheInfo',require('./api/huznheInfo'))
// 查询设置的个人信息
router.post('/getSetInfo',require('./api/getSetInfo'))
// 根据指定key查找INFO表 支持数组 支持单个
router.post('/keyUserInfo',require('./api/keyUserInfo'))
// 我的业绩
router.post('/iperformance',require('./api/iperformance'))
// 每日打卡
router.post('/everydayCal',require('./api/everydayCal'))
// 每日打卡-记录
router.post('/recordCal',require('./api/recordCal'))
// 每日打卡-底部图标数据
router.post('/quxianTarget',require('./api/quxianTarget'))
// 订单操作
router.post('/orderformstate',require('./api/orderformstate'))
// 每日打卡-限制大小
router.post('/everydayCalMax',require('./api/everydayCalMax'))


module.exports = router;