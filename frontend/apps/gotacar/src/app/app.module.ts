import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

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

import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { NoAuthMenuComponent } from './components/no-auth-menu/no-auth-menu.component';
import { AdminTripListPageComponent } from './pages/admin-page/admin-trip-list-page/admin-trip-list-page.component';
import { MeetingPointMapComponent } from './components/meeting-point-map/meeting-point-map.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminMeetingPointsPageComponent } from './pages/admin-page/admin-meeting-points-page/admin-meeting-points-page.component';
import { AuthMenuComponent } from './components/auth-menu/auth-menu.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { ConvertCentToEurPipe } from './pipes/convert-cent-to-eur.pipe';
import { CreateTripFormComponent } from './components/create-trip-form/create-trip-form.component';
import { DriverCreateTripPageComponent } from './pages/authenticated-page/driver-create-trip-page/driver-create-trip-page.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AuthenticatedPageComponent,
    MainHeaderComponent,
    MainFooterComponent,
    ClientProfilePageComponent,
    LogInPageComponent,
    SearchFormComponent,
    MeetingPointMapComponent,
    AdminPageComponent,
    AdminMeetingPointsPageComponent,
    AuthMenuComponent,
    NoAuthMenuComponent,
    AdminTripListPageComponent,
    ConvertCentToEurPipe,
    CreateTripFormComponent,
    DriverCreateTripPageComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
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
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    GoogleMapsModule,
    MatMenuModule,
  ],
  providers: [
    AuthenticatedGuard,
    GeocoderServiceService,
    HttpClientModule,
    AuthServiceService,
    TripsService,
    ConvertCentToEurPipe,
    CurrencyPipe,
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
export class AppModule {}
