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

  updateGroupName(data: any) {
    return this.http.put(
      `${this.api}/group-settings/name`,
      {data}
    );
  }

  updateGroupDescription(data: any) {
    return this.http.put(
      `${this.api}/group-settings/description`,
      data
    );
  }

 updateImage(groupId: string, image: string) {
  return this.http.put(`${this.api}/group-settings/image`, {
    groupId,
    image
  });
}

  toggleMessagePermission(data: any) {
    return this.http.put(
      `${this.api}/group-settings/toggle-message`,
      data
    );
  }

  clearChat(groupId: string) {

  return this.http.delete(
    `${environment.apiUrl}/group-settings/clear-chat/${groupId}`
  );

}



deleteGroup(groupId: string) {

  return this.http.delete(
    `${environment.apiUrl}/group-settings/delete-group/${groupId}`
  );

}

}