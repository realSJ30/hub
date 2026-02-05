import { Suspense } from "react";
import SignUpForm from "./components/signup-form";
import { SignUpSkeleton } from "./components/signup-skeleton";

const SignUpPage = () => {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUpForm />
    </Suspense>
  );
};

export default SignUpPage;
