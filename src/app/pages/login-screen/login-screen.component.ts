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

  // loginWithGoogle() {
  //   window.location.href = 
  //     "https://jsons-and-dragons.onrender.com/auth/google/login";
  // }

  loginWithGoogle() {
    // Mock login
    try {
      // Pretend JWT returned from backend
      const fakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + // header
  'eyJzdWIiOiJmYWtlVXNlckBleGFtcGxlLmNvbSIsIm5hbWUiOiJEZXYgVXNlciJ9.' + // payload
  'signature'; // dummy signature

      // Save token using your AuthService
      this.auth.saveToken(fakeToken);

      // Navigate to the main app
      this.router.navigate(['/character-creation']);
    } catch (err) {
      this.errorMessage = 'Failed to log in (mock)';
    }
  }
}