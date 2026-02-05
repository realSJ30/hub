import { Suspense } from "react";
import SignUpForm from "./components/signup-form";

const SignUpPage = () => {
  return (
    <div className="flex gap-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
};

export default SignUpPage;
