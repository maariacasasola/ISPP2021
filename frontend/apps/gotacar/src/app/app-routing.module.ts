import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { DriverGuard } from './guards/driver.guard';
import { AdminComplaintsListPageComponent } from './pages/admin-page/admin-complaints-list-page/admin-complaints-list-page.component';
import { AdminMeetingPointsPageComponent } from './pages/admin-page/admin-meeting-points-page/admin-meeting-points-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminTripListPageComponent } from './pages/admin-page/admin-trip-list-page/admin-trip-list-page.component';
import { AdminUserListPageComponent } from './pages/admin-page/admin-user-list-page/admin-user-list-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { ClientComplaintPageComponent } from './pages/authenticated-page/client-complaint-page/client-complaint-page.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { ClientContactPageComponent } from './pages/authenticated-page/client-contact-page/client-contact-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { DriverCreateTripPageComponent } from './pages/authenticated-page/driver-create-trip-page/driver-create-trip-page.component';
import { DriverTripListPageComponent } from './pages/authenticated-page/driver-trip-list-page/driver-trip-list-page.component';
import { UserTripListPageComponent } from './pages/authenticated-page/user-trip-list-page/user-trip-list-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { TripSearchResultPageComponent } from './pages/trip-search-result-page/trip-search-result-page.component';
import { TripDetailsPageComponent } from './pages/trip-details-page/trip-details-page.component';
import { AdminComplaintAppealsListPageComponent } from './pages/admin-page/admin-complaint-appeals-list-page/admin-complaint-appeals-list-page.component';
import { AdminPaymentReturnsListPageComponent } from './pages/admin-page/admin-payment-returns-list-page/admin-payment-returns-list-page.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailedComponent } from './pages/payment-failed/payment-failed.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { EditProfileDriverComponent } from './pages/authenticated-page/edit-profile-driver/edit-profile-driver.component';
import { EditProfileClientComponent } from './pages/authenticated-page/edit-profile-client/edit-profile-client.component';
import { RegisterUserGoogleComponent } from './pages/register-user-google/register-user-google.component';
import { DriverTripDetailsPageComponent } from './pages/authenticated-page/driver-trip-details-page/driver-trip-details-page.component';
import { AdminTripOrdersListPageComponent } from './pages/admin-page/admin-trip-orders-page/admin-trip-orders-list-page.component';
import { AdminTripOrderDetailsPageComponent } from './pages/admin-page/admin-trip-orders-page/admin-trip-orders-details/admin-trip-order-details-page.component';
import { AdminDriverRequestsPageComponent } from './pages/admin-page/admin-driver-requests-page/admin-driver-requests-page.component';
import { ClientBecomeDriverPageComponent } from './pages/authenticated-page/client-become-driver-page/client-become-driver-page.component';
import { ShowRatingsComponent } from './pages/show-ratings/show-ratings.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CancelationPolicyComponent } from './components/cancelation-policy/cancelation-policy.component';
import { AdminStatsPageComponent } from './pages/admin-page/admin-stats-page/admin-stats-page.component';
import { AdminAlertPageComponent } from './pages/admin-page/admin-alert-page/admin-alert-page.component';

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
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'google-register',
    component: RegisterUserGoogleComponent,
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
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'cancelation-policy',
    component: CancelationPolicyComponent,
  },
  {
    path: 'about-us',
    component: AboutUsPageComponent,
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
        path: 'user-ratings/:user_id',
        component: ShowRatingsComponent,
      },
      {
        path: 'contact',
        component: ClientContactPageComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileDriverComponent,
      },
      {
        path: 'edit-profile-client',
        component: EditProfileClientComponent,
      },
      {
        path: 'become-driver',
        component: ClientBecomeDriverPageComponent,
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
        path: 'users',
        component: AdminUserListPageComponent,
      },
      {
        path: 'user-ratings/:user_id',
        component: ShowRatingsComponent,
      },
      {
        path: 'complaints',
        component: AdminComplaintsListPageComponent,
      },
      {
        path: 'complaint-appeals',
        component: AdminComplaintAppealsListPageComponent,
      },
      {
        path: 'payment-returns',
        component: AdminPaymentReturnsListPageComponent,
      },
      {
        path: 'trip-orders',
        component: AdminTripOrdersListPageComponent,
      },
      {
        path: 'trip-orders/:trip_order_id',
        component: AdminTripOrderDetailsPageComponent,
      },
      {
        path: 'driver-requests',
        component: AdminDriverRequestsPageComponent,
      },
      {
        path: 'admin-stats',
        component: AdminStatsPageComponent,
      },
      {
        path: 'alert/:user_email',
        component: AdminAlertPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
