import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'create',
    loadComponent: () => import('./text/text.page').then((m) => m.TextPage)
  },
  {
    path: 'edit/:uuid',
    loadComponent: () => import('./text/text.page').then((m) => m.TextPage)
  },
  {
    path: 'text/:uuid',
    loadComponent: () => import('./detail/detail.page').then((m) => m.DetailPage)
  }
];
