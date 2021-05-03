import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  CommonModule,
  CurrencyPipe,
  registerLocaleData,
} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

///FLEX LAYOUT
import { FlexLayoutModule } from '@angular/flex-layout';

// GOOGLE MAPS
import { GoogleMapsModule } from '@angular/google-maps';

// SERVICES
import { TripsService } from './services/trips.service';
import { AuthServiceService } from './services/auth-service.service';
import { GeocoderServiceService } from './services/geocoder-service.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';

// ANGULAR MATERIAL
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { NoAuthMenuComponent } from './components/no-auth-menu/no-auth-menu.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminTripListPageComponent } from './pages/admin-page/admin-trip-list-page/admin-trip-list-page.component';
import { AdminUserListPageComponent } from './pages/admin-page/admin-user-list-page/admin-user-list-page.component';
import { MeetingPointMapComponent } from './components/meeting-point-map/meeting-point-map.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminMeetingPointsPageComponent } from './pages/admin-page/admin-meeting-points-page/admin-meeting-points-page.component';
import { AuthMenuComponent } from './components/auth-menu/auth-menu.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { ClientContactPageComponent } from './pages/authenticated-page/client-contact-page/client-contact-page.component';
import { AdminAlertPageComponent } from './pages/admin-page/admin-alert-page/admin-alert-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { ConvertCentToEurPipe } from './pipes/convert-cent-to-eur.pipe';
import { AccessForbiddenDialogComponent } from './components/access-forbidden/access-forbidden.component';
import { CreateTripFormComponent } from './components/create-trip-form/create-trip-form.component';
import { DriverCreateTripPageComponent } from './pages/authenticated-page/driver-create-trip-page/driver-create-trip-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { UserTripListPageComponent } from './pages/authenticated-page/user-trip-list-page/user-trip-list-page.component';
import { ClientComplaintPageComponent } from './pages/authenticated-page/client-complaint-page/client-complaint-page.component';
import { AdminComplaintsListPageComponent } from './pages/admin-page/admin-complaints-list-page/admin-complaints-list-page.component';
import { TripSearchResultPageComponent } from './pages/trip-search-result-page/trip-search-result-page.component';
import { TripListComponent } from './components/trip-list/trip-list.component';
import { PenaltyDialogComponent } from './components/penalty-dialog/penalty-dialog.component';
import { ComplaintAppealDialogComponent } from './components/complaint-appeal-dialog/complaint-appeal-dialog.component';
import { TripDetailsPageComponent } from './pages/trip-details-page/trip-details-page.component';
import { TripMapComponent } from './components/trip-map/trip-map.component';
import { TripOrderFormDialogComponent } from './components/trip-order-form-dialog/trip-order-form-dialog.component';
import { DriverTripListPageComponent } from './pages/authenticated-page/driver-trip-list-page/driver-trip-list-page.component';
import { CancelTripDialogComponent } from './components/cancel-trip-dialog/cancel-trip-dialog.component';
import { AdminComplaintAppealsListPageComponent } from './pages/admin-page/admin-complaint-appeals-list-page/admin-complaint-appeals-list-page.component';
import { ComplaintAppealsService } from './services/complaint-appeals.service';
import { AdminPaymentReturnsListPageComponent } from './pages/admin-page/admin-payment-returns-list-page/admin-payment-returns-list-page.component';
import { PaymentReturnsService } from './services/payment-returns.service';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailedComponent } from './pages/payment-failed/payment-failed.component';
import { MeetingPointSearchbarResultComponent } from './components/meeting-point-searchbar-result/meeting-point-searchbar-result.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RegisterUserGoogleComponent } from './pages/register-user-google/register-user-google.component';
import { EditProfileDriverComponent } from './pages/authenticated-page/edit-profile-driver/edit-profile-driver.component';
import { EditProfileClientComponent } from './pages/authenticated-page/edit-profile-client/edit-profile-client.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { DriverTripDetailsPageComponent } from './pages/authenticated-page/driver-trip-details-page/driver-trip-details-page.component';
import { AdminTripOrdersListPageComponent } from './pages/admin-page/admin-trip-orders-page/admin-trip-orders-list-page.component';
import { AdminTripOrderDetailsPageComponent } from './pages/admin-page/admin-trip-orders-page/admin-trip-orders-details/admin-trip-order-details-page.component';
import { OrderTripsPipe } from './pipes/order-trips.pipe';
import { CancelTripPlaceDialogComponent } from './components/cancel-trip-place-dialog/cancel-trip-place-dialog.component';
import { AdminDriverRequestsPageComponent } from './pages/admin-page/admin-driver-requests-page/admin-driver-requests-page.component';
import { ClientBecomeDriverPageComponent } from './pages/authenticated-page/client-become-driver-page/client-become-driver-page.component';
import { DriverProfileDataDialogComponent } from './components/driver-profile-data-dialog/driver-profile-data-dialog.component';
import { RatingUserDialogComponent } from './components/rating-user-dialog/rating-user-dialog.component';
import { TripOrderTypePipe } from './pipes/trip-order-type.pipe';
import { RefuseClientTripDriverDialogComponent } from './components/refuse-client-trip-driver-dialog/refuse-client-trip-driver-dialog.component';
import { HelloService } from './services/hello.service';
import { ShowRatingsComponent } from './pages/show-ratings/show-ratings.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CancelationPolicyComponent } from './components/cancelation-policy/cancelation-policy.component';
import { AdminStatsPageComponent } from './pages/admin-page/admin-stats-page/admin-stats-page.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AuthenticatedPageComponent,
    MainHeaderComponent,
    MainFooterComponent,
    ClientProfilePageComponent,
    ClientContactPageComponent,
    AdminAlertPageComponent,
    AboutUsPageComponent,
    LogInPageComponent,
    ErrorPageComponent,
    SearchFormComponent,
    ClientComplaintPageComponent,
    MeetingPointMapComponent,
    AdminPageComponent,
    AdminMeetingPointsPageComponent,
    AuthMenuComponent,
    AdminTripOrderDetailsPageComponent,
    DriverTripListPageComponent,
    CancelTripDialogComponent,
    AdminMenuComponent,
    NoAuthMenuComponent,
    AdminTripListPageComponent,
    AdminUserListPageComponent,
    ConvertCentToEurPipe,
    AccessForbiddenDialogComponent,
    AdminTripOrdersListPageComponent,
    CreateTripFormComponent,
    DriverCreateTripPageComponent,
    UserTripListPageComponent,
    AdminComplaintsListPageComponent,
    ComplaintAppealDialogComponent,
    TripSearchResultPageComponent,
    TripListComponent,
    PenaltyDialogComponent,
    TripDetailsPageComponent,
    TripMapComponent,
    TripOrderFormDialogComponent,
    AdminComplaintAppealsListPageComponent,
    AdminPaymentReturnsListPageComponent,
    PaymentSuccessComponent,
    PaymentFailedComponent,
    AdminDriverRequestsPageComponent,
    MeetingPointSearchbarResultComponent,
    SignUpComponent,
    RegisterUserGoogleComponent,
    EditProfileDriverComponent,
    EditProfileClientComponent,
    DropzoneDirective,
    ImageUploadDialogComponent,
    DriverTripDetailsPageComponent,
    OrderTripsPipe,
    TripOrderTypePipe,
    CancelTripPlaceDialogComponent,
    ClientBecomeDriverPageComponent,
    DriverProfileDataDialogComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    CancelationPolicyComponent,
    RatingUserDialogComponent,
    RefuseClientTripDriverDialogComponent,
    ShowRatingsComponent,
    AdminStatsPageComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule,
    MatStepperModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    GoogleMapsModule,
    MatMenuModule,
    FlexLayoutModule,
    NgxSliderModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthenticatedGuard,
    GeocoderServiceService,
    HttpClientModule,
    HelloService,
    AuthServiceService,
    ComplaintAppealsService,
    PaymentReturnsService,
    TripsService,
    ConvertCentToEurPipe,
    CurrencyPipe,
    TripOrderTypePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
