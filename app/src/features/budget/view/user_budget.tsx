import { useEffect } from 'react';
import { useApplicationContext } from '../../../common/utilities/applicationContext';
import { BudgetService } from '../services/budgetService';

const Content = () => {
    const context = useApplicationContext();
    useEffect(() => {
        var budgetService = new BudgetService(context.getSettingsService().getServerUrl(), context.getAuthenticationService());
        budgetService.GetUserBudget();
    });
    return (<pre>
        Budget daily
    </pre>);
};

export default Content;