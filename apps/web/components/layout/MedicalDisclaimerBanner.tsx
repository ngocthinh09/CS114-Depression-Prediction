import * as React from "react";

export const MedicalDisclaimerBanner = () => {
  return (
    <div className="bg-error-container/90 backdrop-blur-sm text-on-error-container py-4 px-margin-mobile md:px-lg text-center mt-auto border-t border-error/10 relative z-20">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
        <span className="material-symbols-outlined text-xl">warning</span>
        <p className="text-label-md">
          <strong>Important Note:</strong> This is not a medical diagnosis tool. Results are for reference only. Please contact a medical professional if you need help.
        </p>
      </div>
    </div>
  );
};
