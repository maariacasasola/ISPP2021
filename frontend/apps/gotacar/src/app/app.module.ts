import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AuthServiceService } from './services/auth-service.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthenticatedPageComponent } from './pages/authenticated-page/authenticated-page.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { ClientProfilePageComponent } from './pages/authenticated-page/client-profile-page/client-profile-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';

import { environment } from '../environments/environment';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GeocoderServiceService } from './services/geocoder-service.service';

// ANGULAR MATERIAL
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
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
  ],
  providers: [
    AuthenticatedGuard,
    GeocoderServiceService,
    HttpClientModule,
    AuthServiceService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
