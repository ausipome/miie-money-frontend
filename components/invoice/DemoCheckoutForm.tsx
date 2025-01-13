import React, { useState, useEffect } from "react";

export default function DemoCheckoutForm({
  onPaymentSuccess,
}: {
  onPaymentSuccess: () => void;
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const startDemo = () => {
    setIsTyping(true);
    setFormData({ cardholderName: "", cardNumber: "", expiry: "", cvc: "" });
    setIsSuccess(false); // Reset success state

    const steps: { field?: keyof typeof formData; value?: string; delay: number; action?: string }[] = [
      { field: "cardholderName", value: "John Doe", delay: 2000 },
      { field: "cardNumber", value: "4242 4242 4242 4242", delay: 2500 },
      { field: "expiry", value: "12/34", delay: 1000 },
      { field: "cvc", value: "123", delay: 500 },
      { action: "submit", delay: 1000 },
    ];

    let index = 0;

    const typeCharacter = (
      field: keyof typeof formData,
      value: string,
      charIndex: number,
      callback: () => void
    ) => {
      if (charIndex < value.length) {
        setFormData((prev) => ({
          ...prev,
          [field]: value.slice(0, charIndex + 1), // Append one character at a time
        }));
        setTimeout(() => typeCharacter(field, value, charIndex + 1, callback), 100); // Adjust typing speed
      } else {
        callback();
      }
    };

    const typeStep = () => {
      if (index < steps.length) {
        const step = steps[index];
        if (step.action === "submit") {
          handleSubmit();
        } else if (step.field && step.value) {
          typeCharacter(step.field, step.value, 0, () => {
            index++;
            setTimeout(typeStep, step.delay);
          });
        }
      }
    };

    typeStep();
  };

  useEffect(() => {
    startDemo();
  }, [startDemo]);

  const handleSubmit = () => {
    setIsTyping(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true); // Indicate success
      setTimeout(() => {
        onPaymentSuccess();
        startDemo(); // Restart the demo
      }, 2000);
    }, 2000);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="text-center mt-6"
    >
      {/* Simulated Payment Fields */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cardholder Name"
          className="border rounded w-full p-2 mb-2 bg-white text-gray-900"
          value={formData.cardholderName}
          readOnly
        />
        <input
          type="text"
          placeholder="Card Number"
          className="border rounded w-full p-2 mb-2 bg-white text-gray-900"
          value={formData.cardNumber}
          readOnly
        />
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="border rounded w-1/2 p-2 bg-white text-gray-900"
            value={formData.expiry}
            readOnly
          />
          <input
            type="text"
            placeholder="CVC"
            className="border rounded w-1/2 p-2 bg-white text-gray-900"
            value={formData.cvc}
            readOnly
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`mt-4 w-full p-2 text-white rounded ${
          isSuccess
            ? "bg-green-500 hover:bg-green-600"
            : isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={isTyping || isLoading || isSuccess}
      >
        {isSuccess ? "Success" : isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
