import { Injectable } from '@angular/core';
import { MeetingPointService } from "apps/gotacar/src/app/services/meeting-point.service";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";


@Injectable()
export class MeetingPointInterceptor implements HttpInterceptor {

  constructor(public meetingPointService: MeetingPointService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const headers = new HttpHeaders({
      'authorization':'',
    })
    const requestClone = request.clone({
      headers
    })
    return next.handle(requestClone).pipe(
      catchError(this.handleErrors)
    );
  }
  handleErrors(error: HttpErrorResponse){
    console.warn(error)
    return throwError("Error peticion")

  }
  
}
