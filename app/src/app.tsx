import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import SecureRoute from './components/secureRoute'
import Home from './features/home/view/content';
import UserBudget from './features/budget/view/userBudget';
import About from './features/about/view/content';
import NavigationMenu from './components/navigationbar';
import TitleBar from './components/titlebar';
import { SettingsService } from './common/services/settingsService';
import { AuthenticationService } from './common/services/authenticationService';
import { ApplicationContext } from './common/utilities/applicationContext';
import { SigninCallback } from './components/signinCallback';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {
  const context = new AppContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ApplicationContext.Provider value={context}>
        <div className="App">
          <Router basename='/app'>
            <NavigationMenu />
            <TitleBar />
            <Routes>
              <Route path="/" element={<SecureRoute><Home /></SecureRoute>} />
              <Route path="budget">
                <Route path="user" element={<SecureRoute><UserBudget /></SecureRoute>} />
              </Route>
              <Route path="signin-callback" element={<SigninCallback />} />
              <Route path="about" element={<About />} />
            </Routes>
          </Router>
        </div>
      </ApplicationContext.Provider>
    </LocalizationProvider>
  );
};

export default App;

class AppContext {
  private settingsService: SettingsService | undefined;
  private authenticationService: AuthenticationService | undefined;

  public getAuthenticationService(): AuthenticationService {
    if (!this.authenticationService) {
      this.authenticationService = new AuthenticationService(this.getSettingsService().getAuthenticationSettings());
    }
    return this.authenticationService;
  }

  public getSettingsService(): SettingsService {
    if (!this.settingsService) {
      this.settingsService = new SettingsService();
    }
    return this.settingsService;
  }
}