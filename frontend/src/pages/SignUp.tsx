import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../components/auth/AuthLayout";
import Leaves from "../assets/leaves.jpg";

export default function RegisterStudent() {
    return (
        <AuthLayout sideImage={Leaves} imageAlt="Fall leaves at Georgia Tech">
            <RegisterForm />
        </AuthLayout>
    );
}
