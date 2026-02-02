import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  protected authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  selectedTab = 0;
  hidePassword = signal(true);
  
  // Focus states
  emailFocused = false;
  passwordFocused = false;
  nameFocused = false;
  regEmailFocused = false;
  regPasswordFocused = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onTabChange(): void {
    this.authService.clearError();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.router.navigate(['/teams']);
        },
        error: () => {}
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid && !this.authService.isLoading()) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
        next: () => {
          this.router.navigate(['/teams']);
        },
        error: () => {} // Error handled in service
      });
    }
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }
}
