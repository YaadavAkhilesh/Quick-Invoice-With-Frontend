import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getInvoices, deleteInvoice, sendInvoice } from '../services/api'
import toast from 'react-hot-toast'

export default function Invoices() {
  const [sendEmailModal, setSendEmailModal] = useState({ isOpen: false, invoiceId: null })
  const [email, setEmail] = useState('')

  const queryClient = useQueryClient()
  const { data: invoices, isLoading } = useQuery(['invoices'], getInvoices)

  const deleteMutation = useMutation(deleteInvoice, {
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices'])
      toast.success('Invoice deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  const sendMutation = useMutation(
    ({ id, email }) => sendInvoice(id, email),
    {
      onSuccess: () => {
        toast.success('Invoice sent successfully')
        setSendEmailModal({ isOpen: false, invoiceId: null })
        setEmail('')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'An error occurred')
      },
    }
  )

  const handleSendInvoice = (e) => {
    e.preventDefault()
    sendMutation.mutate({ id: sendEmailModal.invoiceId, email })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices including their ID, customer, amount, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/invoices/create" className="btn-primary">
            Create invoice
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Invoice ID
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.i_id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {invoice.i_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {invoice.c_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${invoice.i_amnt_aft_tax.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {invoice.i_status}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => setSendEmailModal({ isOpen: true, invoiceId: invoice.i_id })}
                        className="text-primary hover:text-primary/90 mr-4"
                      >
                        Send
                      </button>
                      <Link
                        to={`/invoices/${invoice.i_id}`}
                        className="text-primary hover:text-primary/90 mr-4"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteMutation.mutate(invoice.i_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {sendEmailModal.isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Send Invoice</h2>
            <form onSubmit={handleSendInvoice} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSendEmailModal({ isOpen: false, invoiceId: null })}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sendMutation.isLoading}
                >
                  {sendMutation.isLoading ? 'Sending...' : 'Send Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}