import { formatCurrency } from "../../utils/formatCurrency.util";

const SummaryCard = ({
    name = 'Money',
    icon = 'bi bi-dollar',
    amount = 0,
    color = 'primary',
}) => {
    return (<div className="col-12 col-md-4">
        <div className="card p-3 ">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <span className="text-uppercase small fw-semibold tracking-wider opacity-75">{name}</span>
                    <h2 className={`text-${color} fw-bold my-2`}>{formatCurrency(amount)}</h2>
                </div>

                <span className={`icon-box bg-${color}-subtle text-${color}`}>
                    <i className={icon}></i>
                </span>
            </div>
        </div>
    </div>);
}

export default SummaryCard;