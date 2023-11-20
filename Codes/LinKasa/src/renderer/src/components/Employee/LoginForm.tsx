import { useState } from "react";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { Link } from "react-router-dom";

function LoginForm(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login , errorMessage } = useUserAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <>
      <form action="" onSubmit={handleLogin} className="flex flex-col mt-5 w-6/12 gap-2">
        <label htmlFor="email">Email</label>
        <input
            id="email"
            placeholder='Please insert your email'
            className="border p-2 rounded-lg focus:outline-none"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder='Please insert your password'
          type="password"
          className="border p-2 rounded-lg focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="pt-2 font-bold text-red-400">{errorMessage}</p>
        <button type="submit" className="p-2 mt-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Login </button>
      </form>
      <Link to="/register">
        <p className="text-blue-500 mt-3 underline">Doesn't have an account? Register here</p>
      </Link>
    </>
  )
}

export default LoginForm;
