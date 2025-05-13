import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // <-- Provide HttpClient here

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    ...CoreModule.providers,
    provideHttpClient(), // <-- Ensure HttpClient is provided
  ],
}).catch((err) => console.error(err));
