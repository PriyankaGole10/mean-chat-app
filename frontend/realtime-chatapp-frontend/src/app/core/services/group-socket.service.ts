import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
providedIn:'root'
})
export class GroupSocketService{

constructor(private socketService:SocketService){}

// JOIN GROUP ROOM
joinGroup(groupId:string){

this.socketService['socket'].emit('join-group',groupId);

}

// LEAVE GROUP ROOM
leaveGroup(groupId:string){

this.socketService['socket'].emit('leave-group',groupId);

}

// LISTEN: MEMBER ADDED
onMemberAdded(callback:(data:any)=>void){

this.socketService['socket'].on('member-added',callback);

}

// LISTEN: MEMBER REMOVED
onMemberRemoved(callback:(data:any)=>void){

this.socketService['socket'].on('member-removed',callback);

}

// LISTEN: ROLE UPDATED
onRoleUpdated(callback:(data:any)=>void){

this.socketService['socket'].on('role-updated',callback);

}

// LISTEN: GROUP UPDATED
onGroupUpdated(callback:(data:any)=>void){

this.socketService['socket'].on('group-updated',callback);

}

// LISTEN: ADMIN TRANSFERRED
onAdminTransferred(callback:(data:any)=>void){

this.socketService['socket'].on('admin-transferred',callback);

}

// LISTEN: GROUP DELETED
onGroupDeleted(callback:(data:any)=>void){

this.socketService['socket'].on('group-deleted',callback);

}

}