const mysql = require('mysql')

const formidable = require('formidable')
var form=new formidable.IncomingForm();
const path = require('path')
const fs = require('fs')
//链接数据库
const connection = require('../session_mysql.js').connection

let fileUpload = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let form = new formidable.IncomingForm();   //创建上传表单
      form.encoding = 'utf-8';        //设置编辑
      form.uploadDir = '/home/bjyyq/static';     //设置上传目录
      form.keepExtensions = true;     //保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.send(err)
          return;        
        }  
        var extName = '';  //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;         
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;         
        }
        // console.log(extName,'extName')
        if(extName == ''){
            res.send(err)
            
            return;                   
        }
        var newPath = form.uploadDir + '/'+ files.file.name;
        // console.log(files.file.path.replace("\/", "\\"))
        let url = files.file.path.replace(/\\/g, "\/")
        // url .replace("\/", "\\")
        // console.log(files.file.path,url)
        // fs.renameSync(files.file.path, newPath);  //重命名
        returnContent.status = 'success'
        returnContent.data = url.split('/')[url.split('/').length-1]
        res.send(returnContent)
    });

    // res.locals.success = '上传成功';
    // res.render('index', { title: TITLE });      
    // form.parse(req,(err,fields,files)=>{
        //报错的时候直接抛出错误
        // if(err){
        //     throw err;
        // }
        // console.log(fields,files)
        //每当触发事件的时候就产生一个随机数
        // var ran=parseInt(Math.random()*89999+10000);
        //获得上传文件的后缀名
        //path.extname获得的是文件从'.'开始到最后的扩展名(是最后一个.)
        // var extname=path.extname(files.name);
        //获得上传文件时的路径
        // const oldPath=__dirname+"/"+files.path;
        //获得放到目的目录的路径
        // const newPath=__dirname+"/uploads/"+ran+extname;
        //在上传文件成功之后，用rename参数进行修改文件名
        //rename的参数有两种使用方法，就是下方的样子，参数为(oldPath,newPath,callback),另一中方法是(oldPath,newPath),即少了回掉函数
        // fs.rename(oldPath,newPath,(err)=>{
        //     if(err){
        //         throw Error('改名失败');
        //     }
        // res.writeHead(200,{"Content-type":"text/plain"});
        // res.end("success");
    // })
// })
    // console.log(req.payload)
    // fileUpload1(req,res);
//     var form = new multiparty.Form();
    
//             form.parse(request.payload, function(err, fields, files) {
//             console.log(fields, files)


}
module.exports = fileUpload