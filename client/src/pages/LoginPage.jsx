import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastMessage from "../common/toastMessage";
import axios from "axios";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitLogin = async (ev) => {
    ev.preventDefault();
    if (email.trim() === "") {
      toastMessage("error", "Please enter email ");
    } else if (password.length < 8) {
      toastMessage(
        "error",
        "Please enter a password with a length of 8 characters or more"
      );
    } else {
      try {
        const { data } = await axios.post("/login", { email, password });
        setUser(data);
        toastMessage("success", "Login successfully");
        setTimeout(() => {
          setIsLogin(true);
        }, 1200);
      } catch (err) {
        toastMessage("error", err.response.data.error);
      }
    }
  };

  if (isLogin) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
          <h1 className="text-4zl text-center mb-4">Login</h1>
          <form className="max-w-md mx-auto" onSubmit={handleSubmitLogin}>
            <input
              placeholder="example@gmail.com"
              type="text"
              value={email}
              onChange={(it) => setEmail(it.target.value)}
            />
            <div className="relative">
              <input
                className="py-2 pl-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={handleTogglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button className="primary">Login</button>
          </form>
          <div className="text-center py-2 text-gray-500">
            Do not have an account yet?
            <Link className="underline  text-bold" to={"/register"}>
              Register
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
