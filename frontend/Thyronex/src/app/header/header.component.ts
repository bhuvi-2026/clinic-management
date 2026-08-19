  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { LoginComponent } from "../login/login.component";

  @Component({
    selector: 'app-header',
    standalone: true,
    imports: [LoginComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
  })
  export class HeaderComponent {

    @Input() isLoggedIn = false;
    @Input() userName: string = '';
    @Input() isAdminRoute = false;
    @Output() triggerLogin = new EventEmitter<void>();
    @Output() triggerDashboard = new EventEmitter<void>();
    @Output() triggerLogout = new EventEmitter<void>();
  }
