import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  //const userMobile = localStorage.getItem('userMobile');

  // =========================================================================
  // 🕒 4-HOUR SESSION CHECK (COMMENTED OUT FOR REFRESH LOGOUT TESTING)
  // =========================================================================
  
  const sessionStr = localStorage.getItem('user_session');

  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      const currentTime = new Date().getTime();
      const fourHoursInMillis = 4 * 60 * 60 * 1000;

      if (session.loginTime && (currentTime - session.loginTime < fourHoursInMillis)) {
        return true;
      } else {
        localStorage.removeItem('user_session');
        alert('Your session has expired (4 hours). Please log in again.');
        router.navigate(['/']);
        return false;
      }
    } catch (e) {
      localStorage.removeItem('user_session');
      router.navigate(['/']);
      return false;
    }
  }
  

  // Current behavior: Redirect to home on refresh / direct URL access without active in-memory login
  // if (userMobile) {
  //   return true; // Logged in -> allow moving to /test-packages
  // }
  
  router.navigate(['/']);
  return false;
};