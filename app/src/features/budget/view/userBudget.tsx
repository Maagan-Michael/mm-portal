import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../../common/utilities/applicationContext';
import { BudgetService } from '../services/budgetService';
import BudgetRecord from '../models/budgetRecord';
import { LineChart, YAxis, XAxis, Line, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import { MenuItem, Select } from '@mui/material';

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
        retrievedData.forEach(i => i.amount = Math.round((i.amount + Number.EPSILON) * 100) / 100);
        setData(retrievedData);
    };

    const defaultFromTimestamp = getDefaultFromTimestamp();
    const defaultToTimestamp = getDefaultToTimestamp();
    const [fromDate, setFromDate] = useState<Dayjs>(defaultFromTimestamp);
    const [toDate, setToDate] = useState<Dayjs>(defaultToTimestamp);
    const [groupBy, setGroupBy] = useState<string>('day');

    useEffect(() => {
        var budgetService = new BudgetService(context.getSettingsService().getServerUrl(), context.getAuthenticationService());
        budgetService.GetUserBudget(fromDate, toDate, groupBy)
            .then(executeSetData);
    }, [fromDate, toDate, groupBy]);

    return (<>
        <div style={{ height: '15px' }}>

        </div>
        <Grid container spacing={2}>
            <Grid item>
                <DatePicker label="From" defaultValue={defaultFromTimestamp} onChange={value => setFromDate(value ?? defaultFromTimestamp)} />
            </Grid>
            <Grid item>
                <DatePicker label="Until" defaultValue={defaultToTimestamp} onChange={value => setToDate(value ?? defaultToTimestamp)} />
            </Grid>
            <Grid item>
                <Select
                    value={groupBy}
                    label="Group By"
                    onChange={event => setGroupBy(event.target.value)}
                >
                    <MenuItem value={'day'}>Day</MenuItem>
                    <MenuItem value={'month'}>Month</MenuItem>
                    <MenuItem value={'year'}>Year</MenuItem>
                </Select>
            </Grid>
        </Grid>
        <div>
            <ChartDisplay data={data} />
        </div>
    </>);
};

export default Content;

function getDefaultFromTimestamp(): Dayjs {
    let defaultFromTimestamp = new Date();
    defaultFromTimestamp.setDate(defaultFromTimestamp.getDate() - 5);
    return dayjs(defaultFromTimestamp);
}

function getDefaultToTimestamp(): Dayjs {
    return dayjs(new Date());;
}