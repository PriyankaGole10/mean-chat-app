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

  getPendingRequests(groupId: string) {
    return this.http.get(
      `${this.api}/group-invite/${groupId}/pending-requests`
    );
  }

   joinViaInvite(inviteCode: string) {
    return this.http.post(
      `${this.api}/group-invite/join/${inviteCode}`,
      {}
    );
  }

  approveRequest(groupId: string, requestId: string) {
  return this.http.patch(
    `${this.api}/group-invite/${groupId}/approve-request/${requestId}`,
    {}
  );
}

rejectRequest(groupId: string, requestId: string) {
  return this.http.patch(
    `${this.api}/group-invite/${groupId}/reject-request/${requestId}`,
    {}
  );
}

}