import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "../../../environments/environment.development";


@Injectable({
    providedIn: 'root'
})

export class SocketService {
    socket!: Socket;


    connetToSocket(userId: string) {
        this.socket = io(environment.apiUrl,
            {
                query: {
                    userId
                }
            }
        )
    }

    joinConversation(conversationId:string){
        this.socket.emit('joinConversation', conversationId );
    }

    sendMeassage(data:any){
        this.socket.emit('sendMessage', data)
    }

    receiveMessage(){
        return this.socket;
    }
}