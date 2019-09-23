const request=require('request');
let messageChat = require('./message.json')
function requestMsg(responseMSg,res,result){
    // console.log(result.xml,'result')
    let str='<xml><ToUserName><![CDATA['+result.xml.FromUserName+']]></ToUserName><FromUserName><![CDATA['+result.xml.ToUserName+']]></FromUserName><CreateTime>'+new Date().getTime()+'</CreateTime><MsgType><![CDATA['+'text'+']]></MsgType><Content><![CDATA['+responseMSg+']]></Content></xml>';
    // request(url,(err,response,body)=>{
    //     let data=JSON.parse(body);
    //     let arr=data.newslist;
    //     let str='<xml><ToUserName><![CDATA['+result.xml.FromUserName+']]></ToUserName><FromUserName><![CDATA['+result.xml.ToUserName+']]></FromUserName><CreateTime>'+new Date().getTime()+'</CreateTime><MsgType><![CDATA['+'news'+']]></MsgType><ArticleCount>'+'2'+'</ArticleCount><Articles><item><Title><![CDATA['+arr[0].title+']]></Title> <Description><![CDATA['+arr[0].description+']]></Description><PicUrl><![CDATA['+arr[0].picUrl+']]></PicUrl><Url><![CDATA['+arr[0].url+']]></Url></item><item><Title><![CDATA['+arr[1].title+']]></Title><Description><![CDATA['+arr[1].deacription+']]></Description><PicUrl><![CDATA['+arr[1].picUrl+']]></PicUrl><Url><![CDATA['+arr[1].url+']]></Url></item></Articles></xml>';
        res.send(str);
    // });
}
function dealText(responseMSg,res,result){
    let str = `<xml>
        <ToUserName><![CDATA[${result.xml.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${result.xml.ToUserName}]]></FromUserName>
        <CreateTime>${new Date().getTime()}</CreateTime>
        <MsgType><![CDATA[news]]></MsgType>
        <ArticleCount>2</ArticleCount>
        <Articles>
            <item>
                <Title><![CDATA[${messageChat[0].name}]]></Title>
                <Description><![CDATA[]]></Description>
                <PicUrl><![CDATA[${messageChat[0].picurl}]]></PicUrl>
                <Url><![CDATA[${messageChat[0].url}]]></Url>
            </item>
            <item>
                <Title><![CDATA[${messageChat[1].name}]]></Title>
                <Description><![CDATA[]]></Description>
                <PicUrl><![CDATA[${messageChat[1].picurl}]]></PicUrl>
                <Url><![CDATA[${messageChat[1].url}]]></Url>
            </item>
        </Articles>
        </xml>`
    res.send(str);
}
exports.dealText=dealText;
exports.requestMsg=requestMsg