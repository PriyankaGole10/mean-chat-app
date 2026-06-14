import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Conversation } from "../api-endpoints/chat";

@Injectable({
    providedIn: 'root'
})

export class ConversationService {
private http = inject(HttpClient);




getUserConversations(){
return this.http.get(environment.apiUrl + Conversation.getUserConversations)
}


createConversations(receiverId:string){
return this.http.post(environment.apiUrl + Conversation.createConversation,{receiverId} )
}


getMessages(conversationId: string){
    return this.http.get(environment.apiUrl + Conversation.getMessages+`/${conversationId}`)
}

sendMessages(payload:any){
    return this.http.post(environment.apiUrl + Conversation.sendMessages,payload)
}

createGroup(data:any){
   return this.http.post(environment.apiUrl + Conversation.createGroup,data )
}

getDownloadApi(messageId: string,mediaIndex: number) {
   return(environment.apiUrl + Conversation.downloadFile+`/${messageId}/${mediaIndex}` )
}



}