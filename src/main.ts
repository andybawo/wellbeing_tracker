import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { CoreModule } from './app/core/core.module';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), ...CoreModule.providers],
}).catch((err) => console.error(err));
