import { Injectable } from '@angular/core';
import {io, Socket } from 'socket.io-client'
 
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket!: Socket;

  constructor() { 
    this.socket = io('http://localhost:3000')
  }

   // send message
  sendMessage(message:any){
    this.socket.emit('send-message',message);
  }

  // receive message
  receiveMessage(callback:(msg:any)=>void){
    this.socket.on('receive-message',callback)
  }

  // connection status
   onconnect(callback:()=>void){
    this.socket.on('connect',callback);
   }

}
