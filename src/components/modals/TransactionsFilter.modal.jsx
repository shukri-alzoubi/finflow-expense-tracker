import { useState } from "react";
import { Transaction } from "../../models/Transaction.model";
import { useData } from "../../context/Data.context";
import DatePicker from "../ui/DatePicker";

const TransactionsFilterModal = ({ initialValue, onSubmit, onClose }) => {
    const defaultValue = {
        query: '',
        type: '',
        categoryId: '',
        range: 'current',
        price: '',
        sortBy: 'newest',
    }

    const { categories } = useData();

    const [filter, setFilter] = useState(initialValue ?? defaultValue);

    const handleSubmitForm = (e) => {
        e.preventDefault();

        onSubmit && onSubmit(filter);
        onCancel && onCancel();
    }

    return (<div className="p-4">
        {/* Header */}
        <div className="text-center mb-5">
            <div className="bg-secondary-subtle text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-funnel-fill fs-2"></i>
            </div>

            <div className="text-body fs-5">Filter Transactions</div>
        </div>
        
        {/* Transaction Filter From */}
        <form id="transaction-filter-modal-form" onSubmit={handleSubmitForm}>

            <div className="row mb-3 g-3">

                {/* Type */}
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Transaction Type</label>
                    <div className="input-group">
                        <select
                            className="form-select py-2"
                            value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                            <option value="">Choose Type...</option>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>

                {/* Sort By */}
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Sort By</label>
                    <select
                        className="form-select border-0 bg-light shadow-none py-2"
                        value={filter.sortBy} onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })} >
                        <option value="newest">Newest</option>
                        <option value="price">Price (high to low)</option>
                    </select>
                </div>
            </div>

            {/* Search */}
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Search</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                    <input
                        type="text" className="form-control border-0 bg-light shadow-none py-2" placeholder="Search merchant..."
                        value={filter.query} onChange={(e) => setFilter({ ...filter, query: e.target.value })} />
                </div>
            </div>

            {/* Category */}
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Category</label>
                    <select
                        className="form-select border-0 bg-light shadow-none py-2"
                        value={filter.categoryId} onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })} >
                        <option value={''}>Choose Category ...</option>
                        {categories.filter((c) => filter.type === '' || filter.type === c.type).map((category) =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )}
                    </select>
                </div>

                {/* Date */}
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Range</label>
                    <div className="input-group shadow-none">
                        <select
                            className="form-select py-2" value={filter.range} onChange={(e) => setFilter({ ...filter, range: e.target.value })}>
                            <option value=''>All Transactions</option>
                            <option value='current'>Current Month</option>
                            <option value='last-30-days'>Last 30 Days</option>
                            <option value='year-to-date'>Year to Date</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>

        <div className="d-flex flex-column gap-4 mt-5">
            <button className="btn btn-primary fw-bold" type="submit" form="transaction-filter-modal-form">
                Save Changes
            </button>

            <div className="d-flex">
                <button type="button" className="btn btn-link text-muted text-decoration-none w-100 btn-sm" onClick={onClose}>
                    Discard
                </button>
              
                <button type="button" className="btn btn-link text-danger text-decoration-none w-100 btn-sm" onClick={() => setFilter(defaultValue)}>
                    Reset Filters
                </button>
            </div>
        </div>

    </div>);
}

export default TransactionsFilterModal;