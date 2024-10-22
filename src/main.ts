import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalService, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService } from '@azure/msal-angular';
import { msalConfig, loginRequest } from '../src/app/auth/auth-config';
import { appConfig } from './app/app.config';

const msalInstance = new PublicClientApplication(msalConfig);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: MSAL_INSTANCE, useValue: msalInstance },
    { provide: MSAL_GUARD_CONFIG, useValue: { interactionType: InteractionType.Redirect, authRequest: loginRequest } },
    MsalService,
    MsalBroadcastService,
    ...appConfig.providers 
  ],
}).catch((err) => console.error(err));