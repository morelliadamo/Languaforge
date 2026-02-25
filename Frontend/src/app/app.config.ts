import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

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
  ],
};
