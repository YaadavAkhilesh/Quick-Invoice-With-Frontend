import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CreateInvoice from './pages/CreateInvoice'
import Templates from './pages/Templates'
import Invoices from './pages/Invoices'
import Payments from './pages/Payments'

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}