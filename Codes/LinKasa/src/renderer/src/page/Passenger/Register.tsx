import RegisterForm from "@renderer/components/Passenger/RegisterForm"
import logo from "../../../../../resources/Logo.png"

function Register()
{
  return(
    <>
      <div className="bg-sky-200 flex flex-col justify-center items-center w-full min-h-screen" >
        <img src={logo} alt="" />
        <RegisterForm />
      </div>
  </>
  )
}

export default Register
