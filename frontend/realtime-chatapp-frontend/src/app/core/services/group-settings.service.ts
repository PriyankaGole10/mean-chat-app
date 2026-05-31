import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupSettingsService {

  private api =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  updateName(data: any) {
    return this.http.put(
      `${this.api}/group-settings/name`,
      data
    );
  }

  updateDescription(data: any) {
    return this.http.put(
      `${this.api}/group-settings/description`,
      data
    );
  }

  updateImage(data: any) {
    return this.http.put(
      `${this.api}/group-settings/image`,
      data
    );
  }

  toggleMessagePermission(data: any) {
    return this.http.put(
      `${this.api}/group-settings/toggle-message`,
      data
    );
  }

}