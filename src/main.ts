import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), ...CoreModule.providers],
}).catch((err) => console.error(err));
