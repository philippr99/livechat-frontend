import { User } from './../_models/user';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUserObservable: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')))
        this.currentUserObservable = this.currentUserSubject.asObservable();
    }

    public get currentUser(): User {
        return this.currentUserSubject.value;
    }

    login(uname: string) {
        return this.http.post<any>('http://localhost:8081/signin', { username: uname })
            .pipe(map(response => {
                var user: User = {
                    uuid: '',
                    username: uname,
                    jwtToken: response.token
                } 
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

}