import { useState } from "react";
import { Transaction } from "../../models/Transaction.model";
import { useData } from "../../context/Data.context";
import DatePicker from "../ui/DatePicker";

const TransactionsFilterModal = ({ initialValue, onSubmit, onCancel, isNew = false }) => {
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

    return (<>
        <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold">Filter Transactions</h5>
            <button type="button" class="btn-close shadow-none" onClick={onCancel}></button>
        </div>
        <div class="modal-body p-4">
            <form onSubmit={handleSubmitForm}>

                <div className="row mb-3 g-3">
                    {/* Type */}
                    <div className="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase">Transaction Type</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                                <option value="">Choose Type...</option>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase">Sort By</label>
                        <select
                            class="form-select border-0 bg-light shadow-none py-2"
                            value={filter.sortBy} onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })} >
                            <option value="newest">Newest</option>
                            <option value="price">Price (high to low)</option>
                        </select>
                    </div>
                </div>

                {/* Search */}
                <div class="mb-3">
                    <label class="form-label small fw-bold text-muted text-uppercase">Search</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                        <input
                            type="text" class="form-control border-0 bg-light shadow-none py-2" placeholder="Search merchant..."
                            value={filter.query} onChange={(e) => setFilter({ ...filter, query: e.target.value })} />
                    </div>
                </div>

                {/* Category */}
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase">Category</label>
                        <select
                            class="form-select border-0 bg-light shadow-none py-2"
                            value={filter.categoryId} onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })} >
                            <option value={''}>Choose Category ...</option>
                            {categories.filter((c) => filter.type === '' || filter.type === c.type).map((category) =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )}
                        </select>
                    </div>

                    {/* Date */}
                    <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted text-uppercase">Range</label>
                        <div className="input-group shadow-none">
                            <select
                                class="form-select" value={filter.range} onChange={(e) => setFilter({ ...filter, range: e.target.value })}>
                                <option value=''>All Transactions</option>
                                <option value='current'>Current Month</option>
                                <option value='last-30-days'>Last 30 Days</option>
                                <option value='year-to-date'>Year to Date</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary w-100 fw-bold mt-4 rounded-3">
                    Apply Changes
                </button>

                <button type="button" class="btn btn-secondary w-100 fw-bold mt-3 rounded-3" onClick={() => setFilter(defaultValue)}>
                    Reset filters
                </button>
            </form>
        </div>
    </>);
}

export default TransactionsFilterModal;