const AWS = require("aws-sdk")
AWS.config.loadFromPath('./config.json');
const SQS = new AWS.SQS({ region: "ap-northeast-1" })
const documentClient = new AWS.DynamoDB.DocumentClient()

const express = require('express');
const app = express();
const http = require('http');
const { start } = require("repl");
const server = http.createServer(app);
const { Server } = require("socket.io");
var io = new Server(server);

const port = process.env.PORT || 3000;

const QueueUrl = "https://sqs.ap-northeast-1.amazonaws.com/105024214522/catgps"

server.listen(port, function () {
    console.log('listening on:' + port);
});

app.use(express.static('public'));



app.get('/',(req,res)=>{

  console.log("query------------------------------------------------------------",req.query)

  let seqnum;
  const seqParams = {
    TableName: 'sequence',
    KeyConditionExpression: 'tablename = :tablename',
    ExpressionAttributeValues: {
      ':tablename': 'nekodoko'
    }
  }

  documentClient.query(seqParams, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2))
    }else{
      console.log("got seq!")
      let seqdata = JSON.parse(JSON.stringify(data, null, 2))
      seqnum = seqdata.Items[0].current_number
      console.log("in callback",seqnum)
      let posDatas = []

      for (let i = seqnum - 4; i <= seqnum; i++){

        const nekodokoParams = {
          TableName:'nekodoko',
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id':i
          }
        }
  
          documentClient.query(nekodokoParams, (err, data) => {
            if (err) {
              console.log(JSON.stringify(err, null, 2))
            }else{
              let posdata = JSON.parse(JSON.stringify(data, null, 2))
              console.log(posdata)
              posDatas.push(posdata)
              console.log(posDatas.length)
            }  

            if(posDatas.length === 5){
              console.log("posdatas",posDatas)
              let items = posDatas.map((val) => {
                return val.Items[0]
              })
              items.sort((a,b) => {
                if(a.id > b.id) return -1;
                if(b.id > a.id) return 1;
              })
              console.log(items)
              res.render('top.ejs',{posdata:items})
            }
          })
      }
      
      
      
    }  
  })


    
  
})




io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit("newjoined","hello");
});



async function processingMessage() {

  const params = {
    QueueUrl,
    MaxNumberOfMessages: 10, // 最大取得メッセージ
    WaitTimeSeconds: 20// ロングポーリング
  }

  while(true){
    try {

      const messages = await SQS.receiveMessage(params).promise() // メッセージを取得
      console.log("messages",messages);
      if(messages.Messages){
        for (message of messages.Messages) {
          const body = JSON.parse(message.Body)
          console.log("message----------------------------------------------",message)
          console.log(body) //メッセージの実態
          io.emit('newposdata',JSON.stringify(body))
          //重い処理
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
          })
          const params =  {
            QueueUrl,
            ReceiptHandle: message.ReceiptHandle
          }
          const deleteResult = await SQS.deleteMessage(params).promise()
          console.log(deleteResult)
        }

      }else{
        console.log("queu is empty")
      }
      
  
    } catch (e) {
      console.error(e)
    }

  }
    
  }

  // function sqsTrigger(posdata){
  //   socket.emit("newposdata",posdata)
  // } 
  
  processingMessage()