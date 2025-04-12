import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';

export const CoreModule = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(DataService, AuthService, AuthGuard),
  ],
};
