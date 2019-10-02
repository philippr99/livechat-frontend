import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.authenticationService.currentUser) {
            request = request.clone({
                setHeaders: {
                    Token: `${this.authenticationService.currentUser.jwtToken}`
                }
            });   
        }
    
        return next.handle(request);
    }
}