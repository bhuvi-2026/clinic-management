import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if session exists in localStorage or sessionStorage
  const userSession = localStorage.getItem('user_session') || sessionStorage.getItem('user_session');

  if (userSession) {
    return true; // User is logged in -> Allow access to /test-packages
  } else {
    // User is NOT logged in -> Redirect back to Home
    router.navigate(['/']);
    return false;
  }
};