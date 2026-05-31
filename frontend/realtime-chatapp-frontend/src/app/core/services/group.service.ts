import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getMembers(groupId: string) {
    return this.http.get(
      `${this.api}/group-members/${groupId}`
    );
  }

  addMember(data: any) {
    return this.http.post(
      `${this.api}/group-members/add`,
      data
    );
  }

  removeMember(data: any) {
    return this.http.post(
      `${this.api}/group-members/remove`,
      data
    );
  }

  leaveGroup(groupId: string) {
    return this.http.post(
      `${this.api}/group-members/leave`,
      { groupId }
    );
  }

  createInvite(groupId: string) {
    return this.http.post(
      `${this.api}/group-invite/${groupId}/invite`,
      {}
    );
  }

  disableInvite(inviteCode: string) {
    return this.http.delete(
      `${this.api}/group-invite/invite/${inviteCode}`
    );
  }

  getJoinRequests(groupId: string) {
    return this.http.get(
      `${this.api}/group-invite/${groupId}/pending-requests`
    );
  }

  approveRequest(requestId: string) {
    return this.http.patch(
      `${this.api}/group-invite/approve-request/${requestId}`,
      {}
    );
  }

  rejectRequest(requestId: string) {
    return this.http.patch(
      `${this.api}/group-invite/reject-request/${requestId}`,
      {}
    );
  }

}