import { useAuth } from "../../context/Auth.context";

const DashboardPage = () => {
    const {logout} = useAuth()


    return ( <>
    Dashboard Page
    
    <button className="btn btn-danger" onClick={logout}>Sign out</button>
    </> );
}
 
export default DashboardPage;