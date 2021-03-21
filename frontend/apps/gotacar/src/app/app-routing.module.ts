import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { CreateTripDriverComponent } from './components/create-trip-driver/create-trip-driver.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '*',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'authenticated',
    component: AuthenticatedPageComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: 'profile',
        component: ClientProfilePageComponent,
      },
      {
        path: 'create-trip',
        component: CreateTripDriverComponent,
      },
    ],
  },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
