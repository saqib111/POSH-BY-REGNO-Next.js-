import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}