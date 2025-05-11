
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

const AuthCard = ({ initialMode = "login" }: AuthCardProps) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const handleSuccessfulSignup = () => {
    setMode("login");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Log in to your account" : "Create a new account"}
        </h1>
        <p className="mt-2 text-gray-600">
          {mode === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in the form to create your ModernBuilder account"}
        </p>
      </div>

      {mode === "login" ? (
        <LoginForm 
          showPassword={showPassword} 
          setShowPassword={setShowPassword} 
        />
      ) : (
        <SignupForm 
          showPassword={showPassword} 
          setShowPassword={setShowPassword} 
          onSuccessfulSignup={handleSuccessfulSignup}
        />
      )}

      <div className="mt-6 text-center">
        {mode === "login" ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setMode("login")}
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
