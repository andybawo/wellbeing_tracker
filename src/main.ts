import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';

bootstrapApplication(AppComponent, {
  providers: [...CoreModule.providers],
}).catch((err) => console.error(err));
