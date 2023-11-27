import * as React from 'react';
import { AuthenticationService } from '../services/authenticationService';
import { SettingsService } from '../services/settingsService';

export interface IApplicationContext {
    getAuthenticationService(): AuthenticationService;
    getSettingsService(): SettingsService;
}

export const ApplicationContext = React.createContext({} as IApplicationContext);

export function useApplicationContext(): IApplicationContext {
    return React.useContext(ApplicationContext);
}