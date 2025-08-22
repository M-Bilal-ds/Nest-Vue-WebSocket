import { Socket, Server } from 'socket.io';
export declare class ChatGateway {
    server: Server;
    handleMessage(client: Socket, message: any): void;
}
