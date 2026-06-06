import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupRoleService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  makeModerator(groupId: string, userId: string) {
    return this.http.post<any>(`${environment.apiUrl}/group-role/make-moderator`, { groupId, userId });
  }

  removeModerator(groupId: string, userId: string) {
    return this.http.post<any>(`${environment.apiUrl}/group-role/remove-moderator`, { groupId, userId });
  }

  addAdmin(groupId: string, userId: string) {
    return this.http.post<any>(`${environment.apiUrl}/group-role/add-admin`, { groupId, userId });
  }

  removeAdmin(groupId: string, userId: string) {
    return this.http.post<any>(`${environment.apiUrl}/group-role/remove-admin`, { groupId, userId });
  }

}