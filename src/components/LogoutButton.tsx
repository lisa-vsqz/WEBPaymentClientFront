// components/LogoutButton.jsx

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => {
        // Ensure both apps redirect to a shared sign-in page or main login page
        signOut({ callbackUrl: 'http://localhost:3001/auth/signin' }); // Replace with the correct sign-in URL
      }}
      className="mb-4 ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
