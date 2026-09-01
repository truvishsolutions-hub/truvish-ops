import React from "react";
import "./PageHeader.css";

const PageHeader = ({ currentStep = 2 }) => {
  return (
    <section className="page-header">
      {/* Page Title */}
      <div className="page-header__title">
        <h1>Create Reward Codes Order</h1>

        <p>
          Create and download reward codes for a client
        </p>
      </div>
    </section>
  );
};

export default PageHeader;