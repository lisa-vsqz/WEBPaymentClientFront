'use client'; 

import { useState } from "react";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { useRouter } from "next/router";

interface FormData {
  paymentDate: Date | null;
  allocatePayment: string | null;
  bankInformation: string | null;
}

const initialData: FormData = {
  paymentDate: null,
  allocatePayment: null,
  bankInformation: null,
};

const BusinessPaymentDetails = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const router = useRouter();

  // Mock data for the comboboxes
  const allocatePaymentOptions = [
    { text: "Account 1", id: 1 },
    { text: "Account 2", id: 2 },
  ];
  
  const bankInformationOptions = [
    { text: "Bank 1", id: 1 },
    { text: "Bank 2", id: 2 },
  ];

  const handleInputChange = (field: keyof FormData, value: Date | string | null) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  

  const handleContinue = () => {
    router.push({
      pathname: "/next-view",
      query: {
        paymentDate: formData.paymentDate ? formData.paymentDate.toISOString() : null,
        allocatePayment: formData.allocatePayment,
        bankInformation: formData.bankInformation,
      },
    });
  };
  

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Business Payments Details</h2>
      
      <div className="mb-4">
        <label className="block text-gray-600">Payment Date</label>
        <DatePicker
          value={formData.paymentDate}
          onChange={(event) => handleInputChange("paymentDate", event.value)}
          format="dd MMM yyyy"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600">Allocate Payment</label>
        <ComboBox
          data={allocatePaymentOptions}
          textField="text"
          dataItemKey="id"
          placeholder="--Select Account--"
          value={formData.allocatePayment}
          onChange={(event) => handleInputChange("allocatePayment", event.value?.text)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-600">Bank Information</label>
        <ComboBox
          data={bankInformationOptions}
          textField="text"
          dataItemKey="id"
          placeholder="--Select Account No.--"
          value={formData.bankInformation}
          onChange={(event) => handleInputChange("bankInformation", event.value?.text)}
        />
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Continue
      </button>
    </div>
  );
};

export default BusinessPaymentDetails;
