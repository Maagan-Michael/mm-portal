import { AuthenticationService } from '../../../common/services/authenticationService';
import { WebProxy } from '../../../common/utilities/webProxy';
import BudgetRecord from '../models/budgetRecord';

export class BudgetService {
    private proxy: WebProxy

    constructor(apiUrl: string, authenticationService: AuthenticationService) {
        this.proxy = new WebProxy(apiUrl, authenticationService);
    }

    public async GetUserBudget(fromTimestamp: Date, toTimestamp: Date): Promise<BudgetRecord[]> {
        if (!fromTimestamp) {
            fromTimestamp = new Date();
            fromTimestamp.setDate(fromTimestamp.getDate() - 5);
        }
        if (!toTimestamp) {
            toTimestamp = new Date();
        }
        let url = `/user-budget?from=${fromTimestamp.toISOString()}&to=${toTimestamp.toISOString()}`;
        let result = await this.proxy.getJson<BudgetRecord[]>(url);
        return result;
    }
}