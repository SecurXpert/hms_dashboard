import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const role = location.state?.role || 'User';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page</h2>
        <p className="text-gray-700">Your role: <span className="font-semibold">{role}</span></p>
      </div>
    </div>
  );
};

export default Home;