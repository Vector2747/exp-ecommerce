import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/clerk-react';
import axiosInstance from './lib/axios.js';
import { Routes, Route, Navigate} from 'react-router';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import { Divide, LoaderIcon } from 'lucide-react';
import PageLoader from './components/PageLoader.jsx';
//import { LoaderIcon } from 'lucide-react';

function App() {
  const getProducts = async () => {
    const res =await axiosInstance.get("/products");
    return res.data;
  }

  const { isSignedIn, isLoaded } = useAuth();

  if(/*true*/!isLoaded) {
    return <PageLoader />

  };
  return (
    /*<div>
      <h1 className='text-red-500 text-3xl'>App</h1>
      <button className='btn btn-primary'>
        click me
      </button>

      {/* Show the sign-in and sign-up buttons when the user is signed out *}
      <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      {/* Show the user button when the user is signed in *}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>*/
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"} /> : < LoginPage />} />
      <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}>
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />

      </Route>
    </Routes>
    
  )
}

export default App;