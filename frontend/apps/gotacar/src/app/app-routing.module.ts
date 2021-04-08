import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { DriverGuard } from './guards/driver.guard';
import { AdminComplaintsListPageComponent } from './pages/admin-page/admin-complaints-list-page/admin-complaints-list-page.component';
import { AdminMeetingPointsPageComponent } from './pages/admin-page/admin-meeting-points-page/admin-meeting-points-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminTripListPageComponent } from './pages/admin-page/admin-trip-list-page/admin-trip-list-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { ClientComplaintPageComponent } from './pages/authenticated-page/client-complaint-page/client-complaint-page.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { DriverCreateTripPageComponent } from './pages/authenticated-page/driver-create-trip-page/driver-create-trip-page.component';
import { DriverTripListPageComponent } from './pages/authenticated-page/driver-trip-list-page/driver-trip-list-page.component';
import { UserTripListPageComponent } from './pages/authenticated-page/user-trip-list-page/user-trip-list-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { TripSearchResultPageComponent } from './pages/trip-search-result-page/trip-search-result-page.component';
import { TripDetailsPageComponent } from './pages/trip-details-page/trip-details-page.component';
import { AdminComplaintAppealsListPageComponent } from './pages/admin-page/admin-complaint-appeals-list-page/admin-complaint-appeals-list-page.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailedComponent } from './pages/payment-failed/payment-failed.component';
import { DriverTripDetailsPageComponent } from './pages/authenticated-page/driver-trip-details-page/driver-trip-details-page.component';

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
    path: 'trip-search-result',
    component: TripSearchResultPageComponent,
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
  },
  {
    path: 'payment-failed',
    component: PaymentFailedComponent,
  },
  {
    path: 'trip/:trip_id',
    component: TripDetailsPageComponent,
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
        canActivate: [DriverGuard],
      },
      {
        path: 'driver-trips',
        component: DriverTripListPageComponent,
        canActivate: [DriverGuard],
      },
      {
        path: 'driver-trips/:trip_id',
        component: DriverTripDetailsPageComponent,
        canActivate: [DriverGuard],
      },
      {
        path: 'trips',
        component: UserTripListPageComponent,
      },
      {
        path: 'trips/:trip/create-complaint',
        component: ClientComplaintPageComponent,
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
      {
        path: 'complaints',
        component: AdminComplaintsListPageComponent,
      },
      {
        path: 'complaint-appeals',
        component: AdminComplaintAppealsListPageComponent,
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
