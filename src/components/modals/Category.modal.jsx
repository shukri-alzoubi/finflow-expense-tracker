import { useState } from "react";
import { Category } from "../../models/Category.model";
import { Tooltip } from "bootstrap";
import HorizontalScroll from "../utils/HorizontalScroll";

const CategoryModal = ({ initialValue, onSubmit, onClose, isNew = false }) => {

    const [category, setCategory] = useState(Category.instance(initialValue));
    const [formError, setFormError] = useState({});

    const validateForm = () => {
        if (!category?.name || category?.name?.trim() === '') return { name: 'required' }
        if (!category?.budget || category?.budget?.trim() !== '' && isNaN(parseFloat(category?.budget))) return { budget: 'invalid' }
        if (!category?.icon || category.icon.trim() === '') return { icon: 'required' }
        if (!category?.color || category.color.trim() === '') return { color: 'required' }

        return null;
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setFormError(validateForm());
            return;
        }

        onSubmit?.(category);
        onClose?.();
    }

    return (<div className="p-4 h-100 overflow-y-auto">

        {/* Header */}
        <div className="text-center mb-4">
            <div 
                className={`bg-${isNew ? 'success' : 'info'}-subtle text-${isNew ? 'success' : 'info'} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-stack fs-2"></i>
            </div>

            <p className="text-body-tertiary small">{!initialValue ? 'Add A New Category' : 'Update An Existing Category'}</p>
        </div>

        {/* Category Form */}
        <form id="category-modal-form" className="row g-3" onSubmit={handleSubmitForm}>

            {/* Type */}
            <div className="btn-group w-100 mb-3" role="group">
                <input type="radio" className="btn-check" name="type" id="exp" onChange={() => { }}
                    checked={category.type === 'expense'} onClick={() => setCategory({ ...category, type: 'expense' })} />
                <label className="btn btn-outline-danger fw-bold" htmlFor="exp">Expense</label>

                <input
                    type="radio" className="btn-check" name="type" id="inc" onChange={() => { }}
                    checked={category.type === 'income'} onClick={() => setCategory({ ...category, type: 'income' })} />
                <label className="btn btn-outline-success fw-bold" htmlFor="inc">Income</label>
            </div>


            {/* Name */}
            <div className="col-12">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                    Category Name
                    {/* Error */}
                    <span className="small text-danger">{formError.name}</span>
                </label>
                <div className="input-group">
                    <input
                        type="text" className="form-control border-0 bg-light shadow-none py-2" placeholder="e.g. Hardware, Office"
                        value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
                </div>
            </div>

            {/* Budget */}
            <div className="col">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                    Monthly Budget Limit ($)
                    <span className="small text-danger">{formError.budget}</span>
                </label>


                <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">$</span>
                    <input
                        type="text" className="form-control border-0 bg-light shadow-none py-2" placeholder="500.00"
                        value={category.budget ?? 0} onChange={(e) => setCategory({ ...category, budget: e.target.value })} />
                </div>
                <div className="form-text small" style={{ fontSize: "11px" }}>Leave empty for no budget limit.</div>
            </div>

            {/* Color */}
            <div className="col-4">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                    Color
                </label>
                <div className="dropdown">
                    <button
                        type="btn "
                        data-bs-toggle="dropdown"
                        className={`btn border-0 bg-body-tertiary w-100 p-1`}>
                        <div className={`w-100 text-${category.color} bg-${category.color}-subtle rounded p-1 border border-${category.color}`}>
                            <i className={`bi bi-${category.icon ?? 'palette-fill'}`}></i>
                        </div>
                    </button>

                    <ul className="dropdown-menu w-100">
                        {["primary", "secondary", "danger", "info", "warning", "success", "light"].map((color) => <li key={color}>
                            <button
                                type="button"
                                className="dropdown-item bg-body-tertiary w-100 p-1"
                                onClick={() => setCategory({ ...category, color: color })}>
                                <div className={`w-100 bg-${color}-subtle text-${color} rounded text-center p-1`}>
                                    <i className="bi bi-palette-fill"></i>
                                </div>
                            </button>
                        </li>)}
                    </ul>
                </div>
            </div>

            {/* Icon */}
            <div className="col-12">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                    Choose Icon
                    <span className="small text-danger">{formError.icon}</span>
                </label>
                <HorizontalScroll>
                    <div className="d-flex gap-2 ">

                        {categoryIcons.map((icon) =>
                            <div
                                className={`icon-box ${icon === category.icon ? 'text-bg-primary' : 'bg-body-tertiary hover-bg'} pointer`}
                                key={icon} onClick={() => setCategory({ ...category, icon: icon })}>
                                <i className={icon}></i>
                            </div>)}
                    </div>
                </HorizontalScroll>
            </div>
        </form>

        {/* Actions */}
        <div className="d-flex flex-column gap-3 mt-5">
            <button className="btn btn-primary fw-bold" type="submit" form="category-modal-form">
                Save Changes
            </button>

            <button type="button" className="btn btn-link text-muted text-decoration-none w-100 btn-sm" onClick={onClose}>
                Discard
            </button>
        </div>
    </div>);
}

const categoryIcons = [
    "bi bi-tags",
    "bi bi-cart",
    "bi bi-briefcase",
    "bi bi-house",
    "bi bi-gear",
    "bi bi-wallet2",
    "bi bi-credit-card",
    "bi bi-cash-stack",
    "bi bi-bank",
    "bi bi-piggy-bank",
    "bi bi-receipt",
    "bi bi-graph-up-arrow",
    "bi bi-lightning",
    "bi bi-car-front",
    "bi bi-airplane",
    "bi bi-cup-hot",
    "bi bi-fork-knife",
    "bi bi-gift",
    "bi bi-heart-pulse",
    "bi bi-controller",
    "bi bi-laptop",
    "bi bi-wrench",
    "bi bi-shield-check",
    "bi bi-telephone"
]

export default CategoryModal;