打开 mongodb，//本机： 进入 C:\Program Files\MongoDB\Server\3.6\bin  后  mongod.exe --dbpath E:\github\my-project\data
进入server文件夹，打开服务器 //node index

于浏览器中用8088端口打开即可

//编辑vue相关文件时，npm run dev 然后使用8080端口测试结果，结束后使用 npm run build生成对应文件

//登陆状态打算在浏览器保存，然后每次需要改变，或查询数据库时携带上本机的信息对登陆状态进行校验（未做 1-28）