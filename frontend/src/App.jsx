import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Main Pages
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import CreateInvoice from './pages/CreateInvoice'
import Payments from './pages/Payments'
import Templates from './pages/Templates'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/customers"
              element={
                <MainLayout>
                  <Customers />
                </MainLayout>
              }
            />
            <Route
              path="/invoices"
              element={
                <MainLayout>
                  <Invoices />
                </MainLayout>
              }
            />
            <Route
              path="/invoices/create"
              element={
                <MainLayout>
                  <CreateInvoice />
                </MainLayout>
              }
            />
            <Route
              path="/payments"
              element={
                <MainLayout>
                  <Payments />
                </MainLayout>
              }
            />
            <Route
              path="/templates"
              element={
                <MainLayout>
                  <Templates />
                </MainLayout>
              }
            />

            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  )
}