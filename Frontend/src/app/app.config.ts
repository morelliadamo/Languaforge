import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // required!
import { provideToastr } from 'ngx-toastr'; // ← this is the key function
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompService } from './services/rx-stomp-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    RxStompService,
    {
      provide: RxStompService,
      useFactory: () => {
        const stomp = new RxStompService();
        stomp.activate();
        return stomp;
      },
    },
    provideAnimations(),
    provideToastr({
      timeOut: 8000,
      positionClass: 'toast-top-center', // or 'toast-top-right', 'toast-bottom-right'...
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      tapToDismiss: false, // user must click close or wait
      newestOnTop: true,
      countDuplicates: false,
    }),
  ],
};
