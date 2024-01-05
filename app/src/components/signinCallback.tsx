import * as React from 'react';
import { AuthenticationService } from '../common/services/authenticationService';
import { SettingsService } from '../common/services/settingsService';

export function SigninCallback() {
    let authSettings = new SettingsService().getAuthenticationSettings();
    let authService = new AuthenticationService(authSettings);
    React.useEffect(() => {
        authService.handleSignin()
            .then(user => {
                if (user) {
                    let returnUrl = "home";
                    if (user.state && (user.state as any).returnUrl) {
                        returnUrl = (user.state as any).returnUrl;
                    }
                    (window as any).location.href = authSettings.applicationRoot + returnUrl;
                }
            });
    });
    return (<></>);
}
