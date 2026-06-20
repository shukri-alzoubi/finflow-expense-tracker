import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import TransactionModal from "../../components/modals/Transaction.modal";
import { useData } from "../../context/Data.context";
import { useNotifier } from "../../context/Notifier.context";
import { dateNow, formatDate } from "../../utils/date.util";
import { formatCurrency } from "../../utils/formatCurrency.util";
import ConfirmModal from "../../components/modals/Confirm.modal";
import TransactionsFilterModal from "../../components/modals/TransactionsFilter.modal";
import { LazyItem } from "../../components/utils/LazyItem";
import { isInRange, isSameMonth, isSameYear } from "../../utils/date.util";
import { Category } from "../../models/Category.model";
import TransactionCard from "../../components/cards/Transaction.card";
import { useRestrictions } from "../../hooks/useRestrictions";

const defaultFilterValue = {
    query: '',
    type: '',
    categoryId: '',
    range: 'current',
    price: '',
    sortBy: 'newest',
}

const TransactionsPage = () => {

    const {
        showLoadingModal,
        showModal,
        closeModal,
        showToast,
    } = useNotifier();

    const {
        categories,
        transactions,
        deleteDocument,
        insertDocument,
        updateDocument,
    } = useData();

    const { canAddTransaction } = useRestrictions();

    const [filter, setFilter] = useState(defaultFilterValue);

    // Filtered Transactions
    const filtered = useMemo(() => {
        let list = transactions.filter((t) => {
            const equalsQuery = (filter.query.trim() === '') || t.description.toLowerCase().includes(filter.query.toLowerCase());
            const equasCategory = (filter.categoryId === '') || filter.categoryId === t.categoryId;
            const equalsType = (filter.type === '') || filter.type === t.type;

            const oneDay = 1000 * 60 * 60 * 24;

            const inRange =
                filter.range === '' ? true :
                    filter.range === 'current' ? isSameMonth(t.date, Date.now()) :
                        filter.range === 'last-30-days' ? isInRange((Date.now() - oneDay * 30), Date.now(), t.date) :
                            filter.range === 'year-to-date' ? isSameYear(t.date, Date.now()) : false;

            return equalsQuery && equasCategory && equalsType && inRange;
        });

        filter.sortBy === 'price' && list.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        return list;
    }, [transactions, filter]);

    // Update Filter
    const handleUpdateFilter = () => {
        showModal(<TransactionsFilterModal
            initialValue={filter}
            onClose={closeModal}
            onSubmit={(newFilter) => setFilter(newFilter)}
        />)
    }

    // Clear Filter
    const handleClearFilter = () => setFilter(defaultFilterValue);

    // Add A New Transaction
    const handleAddTransaction = () => {
        canAddTransaction(() => {
            showModal(<TransactionModal
                isNew
                onClose={closeModal}
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

    // Update Selected Transaction
    const handleUpdateTransaction = (transaction) => {
        showModal(<TransactionModal
            onClose={closeModal}
            initialValue={transaction}
            onSubmit={async (newTransaction) => {
                await showLoadingModal(true);
                try {
                    await updateDocument('transactions', transaction.id, newTransaction);
                    showToast('Transaction was updated', 'primary');
                } catch (error) {
                    console.log(error.message)
                    showToast('Something went wrong', 'danger');
                }
                await showLoadingModal(false);
            }}
        />)
    }

    // Delete Selected Transaction
    const handleDeleteTransaction = (transaction) => {
        showModal(<ConfirmModal
            title="Delete"
            message={`Do you want to delete <span class='text-info'>${transaction.description}</span>?`}
            confirmText="Delete Transaction"
            confirmColor="danger"
            onClose={closeModal}
            onConfirm={async () => {
                await showLoadingModal(true);
                try {
                    await deleteDocument('transactions', transaction.id)
                    showToast('Transaction was deleted', 'danger');
                } catch (error) {
                    console.log(error.message);
                    showToast('Something went wrong', 'danger');
                }
                await showLoadingModal(false); s
            }}
        />)
    }

    return (<MainLayout path="/transactions">

        {/* Header */}
        {/* ============================================= */}
        <div className="row g-3 mb-4">
            <div className="col-12 col-md text-start">
                <h2 className="fw-bold mb-0">Transactions</h2>
                <p className="text-muted small mb-0">
                    Viewing all history for <strong>{filter.range === 'year-to-date' ? dateNow().getFullYear() : filter.range === 'last-30-days' ? 'Last 30 days' : formatDate(dateNow(), 'MMM YYY')}</strong></p>
            </div>

            {/* New Transaction */}
            <div className="col-12 col-md-auto">
                <button className="w-100 btn btn-primary px-4 fw-bold shadow-sm" onClick={handleAddTransaction}>
                    <i className="bi bi-plus-lg me-2"></i>New Transaction
                </button>
            </div>
        </div>

        {/* Filter */}
        {/* ============================================= */}
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div >
                <div className="input-group shadow-none">
                    <span className="input-group-text bg-transparent border-0 pe-0"><i className="bi bi-search"></i></span>
                    <input
                        type="search" className="form-control border-0 " placeholder="Find Transaction..."
                        value={filter.query} onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                    />
                    <span className="input-group-text text-secondary">
                        {filtered.length}
                    </span>
                </div>
            </div>

            {/* Show Filter */}
            <div className="col-auto">
                <button className="btn bg-secondary hover-bg border bg-opacity-25" onClick={handleUpdateFilter}>
                    <i className="bi bi-sliders"></i>
                </button>
            </div>
        </div>

        {/* Transactions */}
        {/* ============================================= */}
        <ul className="list-group list-group-flush">
            {filtered.map((transaction) => {
                const category = categories.find((c) => c.id === transaction.categoryId) ?? Category.instance();

                return <LazyItem key={transaction.id}>
                    <TransactionCard
                        transaction={transaction}
                        category={category}
                        onEdit={() => handleUpdateTransaction(transaction)}
                        onDelete={() => handleDeleteTransaction(transaction)}
                    />
                </LazyItem>
            })}

            {/* New Transaction / Show When There is no transactions */}
            {transactions.length === 0 && <div className="col-12">
                <div className="card transition-card p-3 shadow-sm border-dashed d-flex align-items-center justify-content-center text-center pointer bg-transparent"
                    style={{ border: "2px dashed #dee2e6" }} onClick={handleAddTransaction}>
                    <div className="d-flex align-items-center justify-content-center gap-3">
                        <i className="bi bi-plus-circle text-muted fs-4"></i>
                        <span className="text-muted fw-semibold fs-5">Add you first Transaction</span>
                    </div>
                </div>
            </div>}

        </ul>
    </MainLayout>);
}

export default TransactionsPage;