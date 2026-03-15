import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}