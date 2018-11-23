module.exports = {
  appName: 'koa-info',
  author: 'liuya',
  mongoDB: {
    hostName: '127.0.0.1', // 数据库主机名字（IP）
    port: 27017, // 数据库端口号
    dataBaseName: 'smile-db', // 数据库名字
    userName: '', // 数据库用户名
    passWord: '' // 数据库密码
  },
  host: {
    hostName: 'localhost', // 应用部署的主机名字
    port: 3000 // 应用端口号
  }
}