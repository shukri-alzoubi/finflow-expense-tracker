import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/Auth.context";

const DashboardPage = () => {
    const {logout} = useAuth()


    return ( <MainLayout path="/dashboard">

    </MainLayout> );
}
 
export default DashboardPage;