import { formatDate } from "../../utils/date.util";
import { formatCurrency } from "../../utils/formatCurrency.util";

const TransactionCard = ({ transaction, category, onEdit, onDelete }) => {


    return (<li className="list-group-item rounded bg-body-secondary d-flex align-items-center gap-2 p-2 mb-2">

        {/* Category */}
        <div className={`icon-box bg-${category.color}-subtle text-${category.color} border`}>
            <i className={`${category.icon}`}></i>
        </div>

        {/* Category, Description and due date */}
        <div className="flex-grow-1 text-truncate">
            <div className="fs-sm text-body-tertiary w-100 text-truncate">{category.name}</div>
            <div className="w-100 text-truncate">{transaction.description}</div>
            <div className="fs-sm text-body-tertiary">{formatDate(transaction.date)}</div>
        </div>

        {/* Transaction Type */}
        <div>
            <span className={`badge bg-${transaction.type === 'expense' ? 'danger' : 'success'}-subtle text-${transaction.type === 'expense' ? 'danger' : 'success'}`}>
                {transaction.type === 'expense' ? '-' : '+'} {formatCurrency(transaction.amount)}
            </span>
        </div>

        {/* Actions */}
        <div className="dropdown">

            <button className="btn border-0" data-bs-toggle="dropdown">
                <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>

            <ul className="dropdown-menu">
                <li><button className="btn dropdown-item py-2" onClick={onEdit}>
                    <i className="bi bi-pencil me-2"></i> Edit</button>
                </li>

                <li><hr className="m-0 border-secondary border-opacity-25" /></li>
                <li><button className="btn dropdown-item text-danger py-2" onClick={onDelete}>
                    <i className="bi bi-trash3-fill me-2"></i> Delete
                </button></li>
            </ul>
        </div>

    </li>);
}

export default TransactionCard;