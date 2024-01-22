import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../../common/utilities/applicationContext';
import { BudgetService } from '../services/budgetService';
import { LineChart, YAxis, XAxis, Line, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import { MenuItem, Select } from '@mui/material';

interface IChartRecord {
    globalAmount: number;
    userAmount: number;
    eventDate: string;
}

interface IChartData {
    data: IChartRecord[]
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
                <Line type="monotone" dataKey="userAmount" stroke="#8884d8" />
                <Line type="monotone" dataKey="globalAmount" stroke="#82ca9d" />
            </LineChart >
        </ResponsiveContainer>
    );
};

const Content = () => {
    const context = useApplicationContext();
    const [data, setData] = useState<IChartRecord[]>([]);
    const executeSetData = (retrievedData) => {
        setData(retrievedData);
    };

    const defaultFromTimestamp = getDefaultFromTimestamp();
    const defaultToTimestamp = getDefaultToTimestamp();
    const [fromDate, setFromDate] = useState<Dayjs>(defaultFromTimestamp);
    const [toDate, setToDate] = useState<Dayjs>(defaultToTimestamp);
    const [groupBy, setGroupBy] = useState<string>('day');

    const fetchData = async (budgetService: BudgetService): Promise<IChartRecord[]> => {
        const userData = await budgetService.GetUserBudget(fromDate, toDate, groupBy);
        const globalData = await budgetService.GetAverageBudget(fromDate, toDate, groupBy);
        const dataMap = {} as Map<string, IChartRecord>;
        const result = [] as IChartRecord[];
        globalData.forEach((r, i) => {
            const record = {} as IChartRecord;
            record.eventDate = getChartKey(r.eventDate, groupBy);
            record.globalAmount = roundAmount(r.amount);
            dataMap[record.eventDate] = record;
            result.push(record);
        });
        userData.forEach((r, i) => dataMap[getChartKey(r.eventDate, groupBy)].userAmount = roundAmount(r.amount));

        return result;
    }

    useEffect(() => {
        var budgetService = new BudgetService(context.getSettingsService().getServerUrl(), context.getAuthenticationService());
        fetchData(budgetService)
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

function getChartKey(date: Date, groupBy: string): string {
    const value = dayjs(date);
    if (groupBy == 'day') {
        return value.format('YYYY-MM-DD');
    }
    if (groupBy == 'month') {
        return value.format('YYYY-MM');
    }
    if (groupBy == 'year') {
        return value.format('YYYY');
    }
    throw `Invalid group by '${groupBy}'.`;
}

function getDefaultFromTimestamp(): Dayjs {
    let defaultFromTimestamp = new Date();
    defaultFromTimestamp.setDate(defaultFromTimestamp.getDate() - 5);
    return dayjs(defaultFromTimestamp);
}

function getDefaultToTimestamp(): Dayjs {
    return dayjs(new Date());;
}

function roundAmount(amount: number): number {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}