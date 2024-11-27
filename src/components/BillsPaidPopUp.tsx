import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface BillsPaidPopupProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceList: string[];
}

const BillsPaidPopup: React.FC<BillsPaidPopupProps> = ({
  isOpen,
  onClose,
  invoiceList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-dark hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Title */}
        <p className="font-semibold text-3xl text-center mb-6">Bills Paid</p>

        {/* Content */}
        <div className="text-gray-dark">
          {/* Content Container */}
          <div className="flex items-start">
            {/* Label */}
            <p className="mb-4 text-xl font-semibold text-black flex-shrink-0">
              <strong>Invoice Number:</strong>
            </p>
            {/* List */}
            <ul className="ml-4">
              {invoiceList.map((invoice, index) => (
                <li key={index} className="text-xl mb-2">
                  {invoice} <span>paid correctly</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsPaidPopup;
