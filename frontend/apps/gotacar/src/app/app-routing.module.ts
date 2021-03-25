import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AdminMeetingPointsPageComponent } from './pages/admin-page/admin-meeting-points-page/admin-meeting-points-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminTripListPageComponent } from './pages/admin-page/admin-trip-list-page/admin-trip-list-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { DriverCreateTripPageComponent } from './pages/authenticated-page/driver-create-trip-page/driver-create-trip-page.component';
import { UserTripDetailsPageComponent } from './pages/authenticated-page/user-trip-details-page/user-trip-details-page.component';
import { UserTripListPageComponent } from './pages/authenticated-page/user-trip-list-page/user-trip-list-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
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
    path: 'log-in',
    component: LogInPageComponent,
  },
  {
    path: 'error',
    component: ErrorPageComponent,
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
        path: 'create-trips',
        component: DriverCreateTripPageComponent,
      },
      {
        path: 'trips',
        component: UserTripListPageComponent,
      },
      {
        path: 'trips/:tripId',
        component: UserTripDetailsPageComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'map',
        component: AdminMeetingPointsPageComponent,
      },
      {
        path: 'trips',
        component: AdminTripListPageComponent,
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
