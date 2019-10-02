import { AccountType } from './_types/accountType';
import { GraphqlService } from './_services/graphql.service';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Livechat';
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private graphqlService: GraphqlService
  ) {
    this.authenticationService.currentUserObservable.subscribe(cUser => this.currentUser = cUser)
  }

  ngOnInit(): void {
    this.graphqlService.getUserInformation()
      .subscribe(result => {
      console.log(result.data as AccountType)
    });

    console.log(this.authenticationService.currentUser);
    if(this.authenticationService.currentUser) {
      this.router.navigate(['/home']);
    }else{
      this.router.navigate(['/login']);
    }
    
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
