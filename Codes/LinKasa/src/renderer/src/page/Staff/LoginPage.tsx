import logo from "../../../../../resources/Logo.png"
import LoginForm from "../../components/Employee/LoginForm"

function LoginPage() {

  return (
    <>
      <div className="bg-sky-200 flex flex-col justify-center items-center h-screen w-full">
        <img src={logo} alt="" />
        <LoginForm />
      </div>
    </>
  );
}

export default LoginPage;
