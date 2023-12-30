import { AuthenticationService } from '../../../common/services/authenticationService';
import { WebProxy } from '../../../common/utilities/webProxy';
import BudgetRecord from '../models/budgetRecord';

export class BudgetService {
    private proxy: WebProxy

    constructor(apiUrl: string, authenticationService: AuthenticationService) {
        this.proxy = new WebProxy(apiUrl, authenticationService);
    }

    public async GetUserBudget(): Promise<BudgetRecord[]> {
        var result = await this.proxy.getJson<BudgetRecord[]>('/user-budget');
        return result;
    }
}