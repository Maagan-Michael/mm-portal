import { AuthenticationService } from '../../../common/services/authenticationService';
import { WebProxy } from '../../../common/utilities/webProxy';
import UserBudgetDaily from '../models/userBudgetDaily';

export class BudgetService {
    private proxy: WebProxy

    constructor(apiUrl: string, authenticationService: AuthenticationService) {
        this.proxy = new WebProxy(apiUrl, authenticationService);
    }

    public async GetUserBudgetDaily(): Promise<UserBudgetDaily[]> {
        var result = await this.proxy.getJson<UserBudgetDaily[]>('/user-budget-daily');
        return result;
    }
}