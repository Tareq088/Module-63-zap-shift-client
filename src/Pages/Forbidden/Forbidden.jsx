
import { FaLock } from "react-icons/fa";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
      <div className="max-w-md">
        <div className="text-red-500 text-6xl mb-4">
          <FaLock className="mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-error">403 - Forbidden</h1>
        <p className="mt-4 text-lg text-base-content">
          You don't have permission to access this page.
        </p>
        <p className="text-sm mt-2">Please contact admin if you think this is a mistake.</p>
        <Link to="/" className="btn btn-primary mt-6 text-black">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
