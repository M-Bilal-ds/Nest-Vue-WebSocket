import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

@WebSocketGateway({
    cors: {
        origin: "*",
        credentials: true
    }
})
export class ChatGateway {
    @WebSocketServer() server: Server;
    
    @SubscribeMessage('messageEvent')
    handleMessage(client: Socket, message: any){
        console.log('Received message:', message);
        rl.question('You: ', (answer) => {
            this.server.emit('reply', answer);    
        });   
    }
}