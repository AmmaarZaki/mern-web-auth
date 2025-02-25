import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import FloatingBubble from "./components/FloatingBubble";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import UserEmailVerification from "./pages/UserEmailVerification";
import UserHomePage from "./pages/UserHomePage";
import LoadingSpinner from "./components/LoadingSpinner";
import UserForgotPassword from './pages/UserForgotPassword';
import ResetUserPassword from './pages/ResetUserPassword';

const ProtectedRoute = ({ children }) => {

  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/userLogin' replace />

  } else if (!user.isVerified) {
    return <Navigate to='/userEmailVerification' replace />
  }
  return children;
}

const RedirectAuthenticatedUser = ({ children }) => {

  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }
  return children;
};

function App() {

  const { checkUserAuthentication, isAuthenticated, user, isCheckingAuthentication } = useAuthStore();

  useEffect(() => {
    checkUserAuthentication();
  }, [checkUserAuthentication]);

  if (isCheckingAuthentication) {
    return <LoadingSpinner></LoadingSpinner>
  }

  return (
    <div className='
      min-h-screen
      bg-gradient-to-br
      from-gray-900
      via-blue-900
      to-blue-800
      flex
      items-center
      justify-center
      relative
      overflow-hidden'>

      <FloatingBubble color='bg-blue-900' size='w-56 h-56' top='5%' left='10%' delay={0} />
      <FloatingBubble color='bg-blue-300' size='w-64 h-64' top='40%' left='80%' delay={3} />
      <FloatingBubble color='bg-blue-700' size='w-48 h-48' top='20%' left='50%' delay={5} />
      <FloatingBubble color='bg-blue-500' size='w-28 h-28' top='80%' left='30%' delay={7} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>} />

        <Route
          path="/userSignup"
          element={
            <RedirectAuthenticatedUser>
              <UserSignup />
            </RedirectAuthenticatedUser>} />

        <Route
          path="/userLogin"
          element={
            <RedirectAuthenticatedUser>
              <UserLogin />
            </RedirectAuthenticatedUser>} />

        <Route
          path="/userEmailVerification"
          element={
            <RedirectAuthenticatedUser>
              <UserEmailVerification />
            </RedirectAuthenticatedUser>
          } />

        <Route
          path="/userForgotPassword"
          element={
            <RedirectAuthenticatedUser>
              <UserForgotPassword />
            </RedirectAuthenticatedUser>} />

        <Route
          path='/userResetPassword/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetUserPassword />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path='*'
          element={
            <Navigate to='/' replace />
          }
        />
      </Routes>

      <Toaster />

    </div>
  );
}

export default App;