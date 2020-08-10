# loopback4-demo
这是一个基于loopback4开发的线上购物 restApplicion
主要技术栈</br>
    mongoDB + loopback4 + websocket 
    
## websocketServer
websocketServer 部分代码请看：</br>
https://github.com/ccmanny/loopback4-websocket-demo

## 安装 启动
    安装并启动mongo（demo使用的都是 mongo 默认设置）</br>
    https://www.mongodb.com/
    
    $ git clone https://github.com/ccmanny/loopback4-demo.git
    $ cd loopback4-websocket-demo 
    $ npm i 
    $ npm start 

## 逻辑 用例
主要角色（roles）有 客户（customer） , 商家(shop) , admin</br>
restApplicion 运行在  http://localhost:3000</br>
websocketServer 运行在 http://localhost:3001</br>
客户添加订单的时候，websocketServer可以给该商家推送新订单提醒。

## Models
user ： 用户 </br>
shoppingCart ： 购物车内容</br>
order ： 订单信息</br>
product ： 产品信息</br>
shop ： 店铺信息</br>
errorLog ： 抛错信息纪录</br>
hasmany : </br>
    用户有多个购物车内容，有多个订单</br>
    商店有多个产品</br>
belongsTo:</br>
    购物车内容，订单属于用户</br>
    产品属于商店</br>

## Controllers
error-log : 统计错误信息</br>
product ： 查看产品信息</br>
shop-product ： 商家CURD所属的产品</br>
shop : 查看商家信息</br>
user-order : 用户 CURD 所属 订单信息</br>
user-shop : 用户 CURD 所属 商店信息</br>
user-shoppingCart : 用户 CURD 所属 购物车内容</br>
user : 用户信息CURD</br>

## Services
basic.authorizor ： 认证策略服务</br>
errorLogService ： 添加错误日志信息服务</br>
hash.password.bcryptjs ： 密码加解密 对比服务</br>
jwt-service ： jwt认证服务</br>
vaildateCredentials ： 登录参数验证</br>

## interceptors
test-interceptor ：拦截错误信息</br>
只拦截了pingContorller</br>

## socketioClient
client ： 单例，连接于 wensocketServer</br>
细节请看：https://github.com/ccmanny/loopback4-demo/blob/master/src/socketioClient/client.ts</br>

## collection.aggregate
mongo 聚合</br>
https://github.com/ccmanny/loopback4-demo/blob/master/src/controllers/error-log.controller.ts

## Authentication
登录 user/login 获取jwt </br>
@authenticate('jwt') 解析token</br>
@authorize 认证策略</br>
详细请看：</br>
https://github.com/ccmanny/loopback4-demo/blob/master/src/services/basic.authorizor.ts </br>
https://github.com/ccmanny/loopback4-demo/blob/master/src/services/jwt-service.ts </br>
