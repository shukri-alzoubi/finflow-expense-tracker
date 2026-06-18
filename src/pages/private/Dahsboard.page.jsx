import React, { useEffect, useMemo, useState } from 'react';
import { useNotifier } from '../../context/Notifier.context';
import { useData } from '../../context/Data.context';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { isInRange, isSameMonth, getMonthRange, formatDate } from '../../utils/date.util';
import { formatCurrency } from '../../utils/formatCurrency.util';
import TransactionModal from '../../components/modals/Transaction.modal';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import color_list from '../../assets/json/color_list.json'
import { Category } from '../../models/Category.model';
import { useRestrictions } from '../../hooks/useRestrictions';
import SummaryCard from '../../components/cards/Summary.card';


const DashboardPage = () => {

    const {
        showModal,
        closeModal,
        showLoadingModal,
        showToast,
    } = useNotifier();

    const {
        categories,
        transactions,
        insertDocument,
        updateDocument,
        deleteDocument,
    } = useData();

    const { canAddTransaction } = useRestrictions();

    const [timeflow, setTimeflow] = useState({
        year: new Date().getFullYear(),
        months: [new Date().getMonth()],
    })

    const filtered = useMemo(() => transactions.filter((t) => {
        let tdate = new Date(t.date);

        const inYear = timeflow.year == tdate.getFullYear();
        const inMonths = timeflow.months.length === 0 || timeflow.months.includes(tdate.getMonth());

        return inYear && inMonths;
    }), [timeflow, transactions])


    // Data For Pie Chart
    const distribution = useMemo(() => {
        let spent = 0;
        let income = 0;
        let volume = {};

        filtered.forEach((t) => {
            if (t.type === 'expense') spent += parseFloat(t.amount);
            if (t.type === 'income') income += parseFloat(t.amount);

            if (!volume[t.categoryId]) {
                volume[t.categoryId] = 0
            }

            volume[t.categoryId] += parseFloat(t.amount);
        });

        // Set Budget List
        let spending = Object.keys(volume).map((key) => {
            let category = categories.find((c) => c.id === key);

            return !category ? null : ({ ...category, value: volume[key] })
        }).filter((c) => !!c);

        let total = income - spent;
        return {
            spent, income, total, spending
        }
    }, [filtered])

    // Data For Budgets
    const stats = useMemo(() => {
        let budgets = {};
        let income = 0
        let expenses = 0;


        filtered.forEach((t) => {
            if (budgets[t.categoryId]) budgets[t.categoryId] += parseFloat(t.amount)
            else budgets[t.categoryId] = parseFloat(t.amount);

            // Expense
            if (t.type === 'income') income += parseFloat(t.amount);
            if (t.type === 'expense') expenses += parseFloat(t.amount);

        });

        return {
            budgets,
            profit: (income - expenses),
            income,
            expenses
        };
    }, [filtered, categories])

    // Add A New Transaction
    const handleAddTransaction = () => {
        canAddTransaction(() => {
            showModal(<TransactionModal
                isNew
                onCancel={closeModal}
                onSubmit={async (newTransaction) => {
                    await showLoadingModal(true);
                    try {
                        await insertDocument('transactions', newTransaction);
                        showToast('Transaction was created', 'success');
                    } catch (error) {
                        console.log(error.message)
                        showToast('Something went wrong', 'danger');
                    }
                    await showLoadingModal(false);
                }}
            />)
        })
    }


    const handleToggleMonth = (monthIndex) => {
        setTimeflow({
            ...timeflow, months:
                timeflow.months.includes(monthIndex) ?
                    timeflow.months.filter((m) => m !== monthIndex) :
                    [...timeflow.months, monthIndex]
        })
    }

    const prevYear = () => {
        let year = parseFloat(timeflow.year) - 1;
        if (year > 2000)
            setTimeflow({ ...timeflow, year: year });
    }

    const nextYear = () => {
        let year = parseFloat(timeflow.year) + 1;
        if (year < new Date().getFullYear() + 10)
            setTimeflow({ ...timeflow, year: year });
    }


    return (<MainLayout path='/dashboard'>

        {/* Header */}
        {/* ==================================== */}
        <div className="row gap-2 mb-4">
            <div className='col-12 col-md'>
                <h2 className="fw-bold mb-0">Overview</h2>
                <p className="text-muted small mb-0">Track your spending against your April limits.</p>
            </div>

            <div className="col-12 col-md-auto">
                <button className="w-100 btn btn-primary px-4 fw-bold shadow-sm" onClick={handleAddTransaction}>
                    <i className="bi bi-plus-lg me-2"></i>New Transaction
                </button>
            </div>
        </div>

        {/* Summary Cards */}
        {/* ==================================== */}
        <div className="row mb-3 g-3">

            {/* Net/ Left To Spend */}
            <SummaryCard 
                name='Left to Spend'
                amount={distribution.total}
                icon='bi bi-piggy-bank-fill'
                color='info'
            />

            {/* Income Amount */}
             <SummaryCard 
                name='Income'
                amount={distribution.income}
                icon='bi bi-graph-up-arrow'
                color='success'
            />

            {/* Spent/Expense Amount */}
            <SummaryCard 
                name='Spend'
                amount={distribution.spent}
                icon='bi bi-graph-down-arrow'
                color='danger'
            />

        </div>

        {/* Timeflow */}
        {/* ==================================== */}
        <div className="py-5 ">
            <div className="row gap-2 justify-content-center">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    .map((month, index) =>
                        <span
                            key={index}
                            onClick={() => handleToggleMonth(index)}
                            className={`col-auto badge rounded-3 fs-6 fw-normal text-body ${timeflow.months.includes(index) ? "bg-primary bg-opacity-50" : "bg-body-secondary hover-bg"} px-3 py-2 pointer`}>
                            {month}
                        </span>)}

                {/* Year */}
                <span
                    className={`col-auto badge rounded-3 fs-6 fw-normal text-info bg-info-subtle py-2`}>
                    <div className="d-flex align-itemc-enter justify-content-between">
                        <span
                            className='pe-3 pointer'
                            onClick={prevYear} ><i className="bi bi-chevron-left "></i></span>
                        <span style={{ width: '40px' }}>{timeflow.year}</span>
                        <span
                            className='ps-3 pointer'
                            onClick={nextYear} ><i className="bi bi-chevron-right"></i></span>
                    </div>
                </span>

            </div>
        </div>


        {/* Budgets Card */}
        {/* ==================================== */}
        <div className="row">

            {/* Categories Chart */}
            <div className="col-12 col-md-6 mb-3">
                <div className="card rounded-4 p-4 shadow-sm h-100">
                    <h6 className="small fw-bold text-secondary text-center mb-3">Where it went</h6>
                    <div className="h-100 d-flex justify-content-center">
                        <ResponsiveContainer width={'100%'} height={350} aspect={1.3}>
                            <PieChart>
                                <Pie
                                    data={distribution.spending.map((s) => ({ ...s, color: color_list[s.color].hex }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="65%"
                                    outerRadius="85%"
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {distribution.spending.map((s) => ({ ...s, color: color_list[s.color].hex })).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Spending by Category/ Budgets (Categories) */}
            {/* ==================================== */}
            <div className="col-12 col-md-6 mb-3">
                <div className="card p-4 h-100 overflow-y-auto" style={{ maxHeight: '450px' }}>
                    <h6 className="fw-bold text-muted text-uppercase mb-4 small" style={{ letterSpacing: "1px" }}>
                        Budget Watchlist
                    </h6>

                    <div className="row g-4">
                        {categories
                            .filter((c) => c.budget && parseFloat(c.budget) > 0 && !isNaN(parseFloat(stats.budgets[c.id])))
                            .map((category) => {

                                const spent = stats.budgets[category.id];
                                const limit = parseFloat(category.budget) * (timeflow.months.length === 0 ? 12 : timeflow.months.length);
                                let progress = 0;

                                if (!isNaN(parseFloat(spent)) && !isNaN(parseFloat(limit)) && limit > 0) {
                                    progress = (spent / limit) * 100
                                };

                                return (<div key={category.id} className="col-12">
                                    <div className="d-flex justify-content-between small mb-2">
                                        <span className="fw-bold">
                                            {category.name}
                                            {progress > 75 && <i className="bi bi-exclamation-triangle-fill text-warning ms-1"></i>}
                                        </span>
                                        <span className="text-body-tertiary fw-bold">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
                                    </div>
                                    <div className="progress mb-1">
                                        <div className={`progress-bar bg-${progress > 90 ? 'danger' : progress > 75 ? 'warning' : progress > 35 ? 'primary' : 'success'}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                    {progress > 75 && <span className="text-warning fw-bold" style={{ fontSize: "11px" }}>
                                        <i className="bi bi-exclamation-circle me-1"></i>{(progress).toFixed(0)}% of budget used
                                    </span>}
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Transactions */}
        {/* ==================================== */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header border-bottom py-3 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Recent Activity</h6>
                <Link to='/transactions' className="text-primary text-decoration-none small fw-bold">View All</Link>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-secondary bg-opacity-25">
                        <tr className="text-muted small fw-bold">
                            <th className="border-0 ps-4 py-3">DESCRIPTION</th>
                            <th className="border-0 py-3">CATEGORY</th>
                            <th className="border-0 py-3">DATE</th>
                            <th className="border-0 text-end pe-4 py-3">AMOUNT</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered
                            .filter((t, ind) => ind <= 2)
                            .map((t) => {
                                const category = categories.find((c) => c.id === t.categoryId) ?? Category.instance({ name: 'N/A', color: 'secondary', type: t.type });

                                return (<tr key={t.id}>
                                    <td className="ps-4">
                                        <div className="fw-bold">{t.description}</div>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${category.color}-subtle text-${category.color} rounded-pill border`}>{category.name}</span>
                                    </td>
                                    <td className="text-muted small">{formatDate(t.date)}</td>
                                    <td className={`text-end pe-4 fw-bold text-${t.type === 'expense' ? 'danger' : 'success'}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                </tr>)
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    </MainLayout >);
};

export default DashboardPage;