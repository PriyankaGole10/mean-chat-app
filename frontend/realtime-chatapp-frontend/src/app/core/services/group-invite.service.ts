import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupInviteService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

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