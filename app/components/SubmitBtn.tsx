"use client";

// import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const status = useFormStatus();

  // useEffect(() => {
  //   console.log(status);
  // }, [status]);

  return (
    <button
      className={`bg-[#09090b] flex items-center justify-center gap-3 w-full text-white py-3 rounded-lg mt-3 hover:bg-[#2f2f31] ${
        status.pending ? "cursor-not-allowed bg-[#2f2f31]" : "cursor-pointer"
      }`}
      disabled={status.pending}
    >
      {status.pending && <div className="loader"></div>}
      {status.pending ? "Finding Words..." : "Find Words"}
    </button>
  );
}
