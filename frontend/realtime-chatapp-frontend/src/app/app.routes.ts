import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

{
    path: "",
    redirectTo: 'login',
    pathMatch: 'full'
},
{
    path:'login',
    loadComponent: ()=> import('./features/auth/login/login.component')
    .then(m => m.LoginComponent)
},
{
    path:'register',
    loadComponent:()=>import('./features/auth/register/register.component')
    .then(m => m.RegisterComponent)
},
{
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: ()=>import('./features/chat/chat-page/chat-page.component')
    .then(m => m.ChatPageComponent)
},
{
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: ()=>import('./features/chat/chat-page/components/profile-modal/profile-modal.component')
    .then(m => m.ProfileModalComponent)
},
{
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: ()=>import('./features/chat/chat-page/components/settings/settings.component')
    .then(m => m.SettingsComponent)
},

];
