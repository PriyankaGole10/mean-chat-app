import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Auth } from "../api-endpoints/auth";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    private http = inject(HttpClient);

    

    register(data: any) {
        return this.http.post(environment.apiUrl + Auth.register, data)
    }

    login(data: any) {
        return this.http.post(environment.apiUrl + Auth.login, data)
    }

    getMe() {
        return this.http.get(environment.apiUrl + Auth.me)
    }

    saveToken(token:string){
        localStorage.setItem('token', token);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    isLoggedIn(){
        return !!this.getToken()
    }

    logout(){
        localStorage.removeItem('token');
    }



}