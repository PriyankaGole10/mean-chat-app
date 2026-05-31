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

}