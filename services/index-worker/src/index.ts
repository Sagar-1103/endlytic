import amqp, { Connection } from "amqplib/callback_api";

amqp.connect("amqp://localhost",function(error0:Error,connection:Connection) {
    if(error0){
        throw error0;
    }
    connection.createChannel(function(error1,channel) {
        if(error1){
            throw error1;
        }
        const queue = "collections";

        channel.assertQueue(queue,{
            durable:true
        });

        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue,function(message){
            if(message){
                console.log(" [x] Received %s", message.content.toString());
                channel.ack(message);
            }
        },{
            noAck: false
        })
    })
})