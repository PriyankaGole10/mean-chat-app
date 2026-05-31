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
  ) {}

  addAdmin(data: any) {
    return this.http.post(
      `${this.api}/group-role/add-admin`,
      data
    );
  }

  removeAdmin(data: any) {
    return this.http.post(
      `${this.api}/group-role/remove-admin`,
      data
    );
  }

  makeModerator(data: any) {
    return this.http.post(
      `${this.api}/group-role/make-moderator`,
      data
    );
  }

  removeModerator(data: any) {
    return this.http.post(
      `${this.api}/group-role/remove-moderator`,
      data
    );
  }

}