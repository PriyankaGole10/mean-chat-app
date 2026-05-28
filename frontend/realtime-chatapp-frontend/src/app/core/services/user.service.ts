import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)
 


  searchUsers(query: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/users/search-user?query=${query}`);
  }


}
