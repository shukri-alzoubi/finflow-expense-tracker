import { useState } from "react";
import { Transaction } from "../../models/Transaction.model";
import { useData } from "../../context/Data.context";
import DatePicker from "../ui/DatePicker";

const TransactionModal = ({ initialValue, onSubmit, onCancel, isNew = false }) => {
    const { categories } = useData();

    const [transaction, setTransaction] = useState(Transaction.instance(initialValue));
    const [formError, setFormError] = useState({});

    const validateForm = () => {

        if (!transaction?.amount || transaction?.amount === '') return { amount: 'required' }
        if (isNaN(parseFloat(transaction?.amount))) return { amount: 'invalid' }
        if (!transaction?.description || transaction?.description.trim() === '') return { description: 'required' }
        if (!transaction?.categoryId || transaction?.categoryId.trim() === '') return { categoryId: 'required' }
        if ((transaction?.date ?? '') === '') return { date: 'required' }

        return null;
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        setFormError({});
        if (validateForm()) {
            setFormError(validateForm());
            return;
        }

        onSubmit && onSubmit(transaction);
        onCancel && onCancel();
    }

    return (<>
        <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold">{isNew ? 'New Transaction' : 'Update Transaction'}</h5>
            <button type="button" className="btn-close shadow-none" onClick={onCancel}></button>
        </div>
        <div className="modal-body p-4">
            <form onSubmit={handleSubmitForm}>

                {/* Type */}
                <div className="btn-group w-100 mb-4" role="group">
                    <input type="radio" className="btn-check" name="type" id="exp" onChange={() => { }}
                        checked={transaction.type === 'expense'} onClick={() => setTransaction({ ...transaction, type: 'expense', categoryId: '' })} />
                    <label className="btn btn-outline-danger fw-bold py-2" htmlFor="exp">Expense</label>

                    <input
                        type="radio" className="btn-check" name="type" id="inc" onChange={() => { }}
                        checked={transaction.type === 'income'} onClick={() => setTransaction({ ...transaction, type: 'income', categoryId: '' })} />
                    <label className="btn btn-outline-success fw-bold py-2" htmlFor="inc">Income</label>
                </div>

                {/* Amount */}
                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                        Amount
                        {/* Error */}
                        <span className="small text-danger">{formError?.amount}</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0">$</span>
                        <input
                            type="text" className="form-control border-0 bg-light shadow-none py-2" placeholder="0.00"
                            value={transaction.amount} onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })} />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                        Description
                        {/* Error */}
                        <span className="small text-danger">{formError?.description}</span>
                    </label>
                    <input
                        type="text" className="form-control border-0 bg-light shadow-none py-2" placeholder="e.g. Server Hosting"
                        value={transaction.description} onChange={(e) => setTransaction({ ...transaction, description: e.target.value })} />
                </div>

                {/* Category */}
                <div className="row">
                    <div className="col-6">
                        <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                            Category
                            {/* Error */}
                            <span className="small text-danger">{formError?.categoryId}</span>
                        </label>
                        <select
                            className="form-select border-0 bg-light shadow-none py-2"
                            value={transaction.categoryId} onChange={(e) => setTransaction({ ...transaction, categoryId: e.target.value })} >
                            <option value={' '}>Choose Category ...</option>
                            {categories
                            .filter((c) => c.type === transaction.type)
                            .map((category) =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="col-6">
                        <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                            Date
                            {/* Error */}
                            <span className="small text-danger">{formError?.date}</span>
                        </label>
                        <DatePicker
                            value={transaction.date}
                            onChange={(mdate) => setTransaction({ ...transaction, date: mdate })}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mt-4 rounded-3">
                    Save Transaction
                </button>
            </form>
        </div>
    </>);
}

export default TransactionModal;