import { useState } from "react";
import { Category } from "../../models/Category.model";
import { Tooltip } from "bootstrap";
import HorizontalScroll from "../utils/HorizontalScroll";

const CategoryModal = ({ initialValue, onSubmit, onCancel }) => {

    const [category, setCategory] = useState(Category.instance(initialValue));
    const [formError, setFormError] = useState({});

    const validateForm = () => {
        if (!category?.name || category?.name?.trim() === '') return { name: 'required' }
        if (category?.budget?.trim() !== '' && isNaN(parseFloat(category?.budget))) return { budget: 'invalid' }
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

        onSubmit && onSubmit(category);
        onCancel && onCancel();
    }

    return (<>
        <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold">Category Settings</h5>
            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
        </div>
        <div className="modal-body p-4">
            <form className="row g-3" onSubmit={handleSubmitForm}>

                {/* Type */}
                <div className="btn-group w-100 mb-3" role="group">
                    <input type="radio" className="btn-check" name="type" id="exp" onChange={() => { }}
                        checked={category.type === 'expense'} onClick={() => setCategory({ ...category, type: 'expense' })} />
                    <label className="btn btn-outline-danger fw-bold py-2" htmlFor="exp">Expense</label>

                    <input
                        type="radio" className="btn-check" name="type" id="inc" onChange={() => { }}
                        checked={category.type === 'income'} onClick={() => setCategory({ ...category, type: 'income' })} />
                    <label className="btn btn-outline-success fw-bold py-2" htmlFor="inc">Income</label>
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
                <div className="col-12">
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

                {/* Color */}
                <div className="col-12 mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                        Choose Color
                        <span className="small text-danger">{formError.color}</span>
                    </label>
                    <HorizontalScroll>
                        <div className="d-flex gap-2">
                            {["primary", "secondary", "danger", "info", "warning", "success", "light"].map((color) =>
                                <div
                                    className={`icon-box border pointer bg-${color ?? 'primary'}-subtle text-${color ?? 'primary'}  ${category.color === color && 'border-primary'}`}
                                    key={color} onClick={() => setCategory({ ...category, color: color })}>
                                    <i className={category.icon ?? 'bi bi-circle-fill'}></i>
                                </div>)}
                        </div>
                    </HorizontalScroll>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm">Save Category</button>
            </form>
        </div>
    </>);
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