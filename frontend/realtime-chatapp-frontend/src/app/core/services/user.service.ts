import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../api-endpoints/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)
 


  searchUsers(query: string) {   
    return this.http.get<any[]>(environment.apiUrl+ User.searchUser + query);
  }

  getAllUsers(){
  return this.http.get(environment.apiUrl + User.getAllUsers)
  }


}
