import { Link } from "react-router-dom";
import { useData } from "../../context/Data.context";
import { useMemo } from "react";
import { useCustomer } from "../../context/Customer.context";

const UsageCard = () => {
    const {
        categories,
        transactions,
    } = useData();

    const {customer, currentPlan} = useCustomer();

    const usages = useMemo(() => {
        return {
            transactions: {name: 'Transactions', limit: currentPlan.limits.transactions, size: transactions.length, },
            categories: { name: 'Categories', limit: currentPlan.limits.categories, size: categories.length, },
        }
    }, [currentPlan, transactions, categories])

    return (<div className="row g-4">


        {Object.values(usages ?? {}).map((usage, index) => {
            const progress = usage.limit === -1 ? 100 : Math.ceil((usage.size / usage.limit) * 100).toFixed(0);

            return (<div key={index} className="col-12 small">
                <div className="d-flex small fw-bold mb-1 gap-2">
                    <span className="flex-grow-1 text-start">{usage.name}</span>
                    {usage.limit !== -1 && <span>{usage.size}</span>}
                    {usage.limit !== -1 && <span> / </span>}
                    <span>{usage.limit === -1 ? <i className="bi bi-infinity text-danger-emphasis"></i> : usage.limit}</span>
                </div>

                <div className="progress" style={{ height: "6px" }}>
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>


            </div>)
        })}
    </div>)
}

export default UsageCard;