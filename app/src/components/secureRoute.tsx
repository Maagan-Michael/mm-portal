import * as React from 'react';
import { useEffect } from 'react';
import { useApplicationContext } from '../common/utilities/applicationContext';

export default function SecureRoute(props: any) {
    const context = useApplicationContext();
    const authService = context.getAuthenticationService();
    useEffect(() => {
        const loginIfNeeded = async () => {
            console.log("Get user");
            try {
                const user = await authService.getUser();
                if (!user) {
                    authService.login();
                }
            }
            catch (error) {
                console.log("Failed to get user");
                console.error(error);
            }

        };

        loginIfNeeded();
    }, [authService]);
    return (<>{props.children}</>);
}