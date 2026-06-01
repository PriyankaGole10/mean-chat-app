import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getMembers(
    groupId: string
  ) {
    return this.http.get(
      `${this.api}/group-member/${groupId}`
    );
  }

  addMember(
    groupId: string,
    userId: string
  ) {
    return this.http.post(
      `${this.api}/group-member/add`,
      {
        groupId,
        userId
      }
    );
  }

  removeMember(
    groupId: string,
    userId: string
  ) {
    return this.http.post(
      `${this.api}/group-member/remove`,
      {
        groupId,
        userId
      }
    );
  }

  leaveGroup(
    groupId: string
  ) {
    return this.http.post(
      `${this.api}/group-member/leave`,
      {
        groupId
      }
    );
  }

}