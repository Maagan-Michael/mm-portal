import { useEffect, useState } from 'react';
import { useApplicationContext } from '../../../common/utilities/applicationContext';
import { BudgetService } from '../services/budgetService';
import BudgetRecord from '../models/budgetRecord';
import { LineChart, YAxis, XAxis, Line, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface IChartData {
    data: BudgetRecord[]
}

const ChartDisplay = ({ data }: IChartData) => {
    return (
        <ResponsiveContainer width="80%" height="80%" minHeight={600}>
            <LineChart
                data={data}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
            >
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="eventDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart >
        </ResponsiveContainer>
    );
};

const Content = () => {
    const context = useApplicationContext();
    const [data, setData] = useState<BudgetRecord[]>([]);

    const executeSetData = (retrievedData) => {
        retrievedData.forEach(i=>i.amount = Math.round((i.amount + Number.EPSILON) * 100) / 100);
        setData(retrievedData);
    };
    useEffect(() => {
        var budgetService = new BudgetService(context.getSettingsService().getServerUrl(), context.getAuthenticationService());
        budgetService.GetUserBudget()
            .then(executeSetData);
    }, []);
    return (<ChartDisplay data={data} />);
};

export default Content;