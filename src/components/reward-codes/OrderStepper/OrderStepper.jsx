// src/components/reward-codes/PageHeader/PageHeader.jsx

import React from "react";
import "./OrderStepper.css";

const steps = [
  {
    number: 1,
    label: "Client",
  },
  {
    number: 2,
    label: "Denomination & Quantity",
  },
  {
    number: 3,
    label: "Validity & Fee",
  },
  {
    number: 4,
    label: "Theme & Download",
  },
];

const OrderSteper = ({ currentStep = 2 }) => {
  return (
    <section className="page-header">

      <div className="order-stepper">
        {steps.map((step, index) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              <div
                className={`order-step ${
                  isDone ? "order-step--done" : ""
                } ${isActive ? "order-step--active" : ""}`}
              >
                <span className="order-step__number">
                  {isDone ? "✓" : step.number}
                </span>

                <span className="order-step__label">
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`order-step__separator ${
                    step.number < currentStep
                      ? "order-step__separator--done"
                      : ""
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

export default OrderSteper;