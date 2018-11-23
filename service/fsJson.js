// 主要了解一下node的fs模块
const fs = require('fs')

// 读文件
fs.readFile('./data_json/goods.json', 'utf-8', function(err, data){
  let i=0
  let pushData=[]
  if (err) {
    console.log('读文件操作失败')
    return
  } else {
    let newData= JSON.parse(data)
    newData.RECORDS.map(function(value,index){
      if(value.IMAGE1!=null){
        i++
        pushData.push(value)
      }
    })
  }
  // 写入文件
  fs.writeFile('./data_json/newGoods.json',JSON.stringify(pushData), function(err){
    if(err) console.log('写文件操作失败')
    else console.log('写文件操作成功')
  })
})