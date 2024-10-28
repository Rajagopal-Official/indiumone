import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '6b531bab-1be8-4cb9-bb40-737e16464691',
    authority: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize? ',
    redirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: 'localStorage', 
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['user.read'],
};