import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getMembers(groupId: string): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.apiUrl}/group-member/${groupId}`
  );
}

commonGroupsWithMember(memberId: string): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.apiUrl}/group-member/common-groups/${memberId}`
  );
}

  addMembers(
    groupId: string,
    userIds: any[]
  ) {
    return this.http.post(
      `${this.api}/group-member/add`,
      {
        groupId,
        userIds
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