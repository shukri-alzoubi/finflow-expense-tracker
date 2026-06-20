import { useMemo } from "react";
import { formatDate } from "../../utils/date.util";
import { formatCurrency } from "../../utils/formatCurrency.util";

const CategoryCard = ({ category, spent, onEdit, onDelete }) => {

    const progress = useMemo(() => {
        let amount = 0;
        if (spent && (category.budget ?? '') !== '' && !isNaN(parseFloat(category.budget)) && parseFloat(category.budget) > 0) {
            amount = (spent / category.budget) * 100
        };

        return amount;

    }, [category, spent])

    return (<div className="card transition-card p-4 shadow-sm">

        {/* Icon and actions */}
        <div className="d-flex justify-content-between align-items-start mb-4">
            <div className={`icon-box bg-${category.color}-subtle text-${category.color}`}>
                <i className={`${category.icon}`}></i>
            </div>

            <div className="dropdown">
                <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown"><i className="bi bi-three-dots-vertical"></i></button>
                <ul className="dropdown-menu border-0 shadow-sm">
                    <li><button className="dropdown-item small" onClick={onEdit}>Edit</button></li>
                    <li><button className="dropdown-item small text-danger" onClick={onDelete}>Delete</button></li>
                </ul>
            </div>

        </div>
        {/* Name & Last Update */}
        <h5 className="fw-bold mb-1">{category.name}</h5>
        <p className="text-muted small mb-3">{formatDate(category.updatedAt)}</p>

        {/* Budgetting */}
        <div>
            <div className="d-flex justify-content-between small fw-bold mb-1">
                <span className="text-secondary">Spent: {formatCurrency(spent ?? 0)}</span>
                <span className="text-muted">Limit: {formatCurrency(category.budget ?? 0)}</span>
            </div>
            <div className="progress mb-2">
                <div className={`progress-bar bg-${progress > 90 ? 'danger' : progress > 75 ? 'warning' : progress > 35 ? 'primary' : 'success'}`} style={{ width: `${progress}%` }}></div>
            </div>
            {progress > 75 && <span className="text-warning fw-bold" style={{ fontSize: "11px" }}>
                <i className="bi bi-exclamation-circle me-1"></i>{(progress).toFixed(0)}% of budget used
            </span>}
        </div>

    </div>);
}

export default CategoryCard;