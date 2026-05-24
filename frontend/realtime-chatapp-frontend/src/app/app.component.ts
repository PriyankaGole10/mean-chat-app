import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'realtime-chatapp-frontend';
  currentUser = '';

private auth = inject(AuthService);

ngOnInit(){
this.loadUser();
}


  loadUser() {
    if (sessionStorage.getItem('token')) {
      this.auth.getMe().subscribe({
        next: (res: any) => {
          console.log("USER:", res.user);
          this.currentUser = res.user.username
        },
        error: () => {
          sessionStorage.removeItem('token');
        }
      });
    }
  }

}
