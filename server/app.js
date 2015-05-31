"use strict";

var http = require('http');
var fs = require('fs');
var url = require('url');
var crypto = require('crypto');

//静态资源目录
global.STATIC_PATH = "../public/";
global.PATH_LINE = __dirname.match(/\/|\\/)[0];

var router = require('easy-router')({
    "/topic/*":"url:./txwork/topic_*.html",

    "/public/**/*":"url:"+STATIC_PATH+"**/*"        //静态资源
});

require('./bigpipe/bigpipe');
require('./creeper/creeper');
require('./upload/upload');
require('./pjax/pjax');
require('./transdata/tdata');
require('./crossorigin/cross');
var websocket = require("./websocket/socket");

var server = http.createServer(function(req , res){
    router.route(req , res);
}).listen(9030);

websocket.update(server , function(ws){
    ws.on('close' , function(reason){
        console.log("socket closed:"+reason);
    });

    ws.on('message' , function(data){
        websocket.brocast(data);
    });
});

console.log("服务启动成功...");

global.directTo404 = function(res){
    router.error(res);
};
