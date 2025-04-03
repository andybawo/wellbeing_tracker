import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';

export const CoreModule = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(DataService, AuthService),
  ],
};
