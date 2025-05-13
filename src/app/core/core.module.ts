import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
// import { AuthGuard } from './guards/auth.guard';
// import { AuthInterceptor } from './interceptor/auth.interceptor';

export const CoreModule = {
  providers: [
    // provideHttpClient(withInterceptors([AuthInterceptor])),
    provideHttpClient(),
    importProvidersFrom(DataService, AuthService),
    // importProvidersFrom(DataService, AuthService, AuthGuard),
  ],
};
