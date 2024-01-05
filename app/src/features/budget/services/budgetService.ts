import { Dayjs } from 'dayjs';
import { AuthenticationService } from '../../../common/services/authenticationService';
import { WebProxy } from '../../../common/utilities/webProxy';
import BudgetRecord from '../models/budgetRecord';

export class BudgetService {
    private proxy: WebProxy

    constructor(apiUrl: string, authenticationService: AuthenticationService) {
        this.proxy = new WebProxy(apiUrl, authenticationService);
    }

    public async GetUserBudget(fromTimestamp: Dayjs, toTimestamp: Dayjs): Promise<BudgetRecord[]> {
        let url = `/user-budget?from=${fromTimestamp.toISOString()}&to=${toTimestamp.toISOString()}`;
        let result = await this.proxy.getJson<BudgetRecord[]>(url);
        return result;
    }
}