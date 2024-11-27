import { Button } from "@progress/kendo-react-buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

interface AuthorizationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDate: string;
  debitDate: string;
  amount: string;
  bankDetails: string;
  onAuthorize: () => void;
}

const AuthorizationPopup: React.FC<AuthorizationPopupProps> = ({
  isOpen,
  onClose,
  paymentDate,
  debitDate,
  amount,
  bankDetails,
  onAuthorize,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-12 px-16 w-11/12 max-w-xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-dark hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Title */}
        <p className="font-semibold text-3xl text-center mb-8 mt-4">
          Authorization
        </p>

        {/* Content */}
        <div className="text-gray-dark justify-center">
          <p className="mb-6 text-xl font-semibold text-black text-center ">
            <strong>Payment Date:</strong>{" "}
            <span className="text-blue-primary">{paymentDate}</span>
          </p>
          <p className="text-xl text-center">
            ePay portion will be funded via{" "}
          </p>
          <p className="mb-6 text-xl text-center">
            <strong className="text-blue-primary">Pre-Authorized Debit</strong>
          </p>
          <p className="mb-6 text-xl text-center">
            <span className="font-bold">{amount}</span> will be debited on{" "}
            <strong>{debitDate}</strong> from{" "}
            <span className="font-semibold">{bankDetails}</span>.
          </p>
          <p className="text-black text-xl text-center font-semibold mt-4">
            Do you want to authorize this payment?
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end">
          <Button
            className="btn pe-button pe-primary ml-2"
            onClick={onAuthorize}
          >
            <FontAwesomeIcon icon={faCheck} className="text-white mr-2" />
            <span>Yes, Authorize</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationPopup;
