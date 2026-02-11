import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  private authService = inject(AuthService);

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getCurrentUser().subscribe({
        error: () => this.authService.logout()
      });
    }
  }
}
