import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.less'],
  imports: [CommonModule]
})
export class LoginComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  errorMessage = '';

    ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.auth.saveToken(token);
        this.router.navigate(['/home']);
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 
      "http://localhost:8000/auth/login";
  }
}