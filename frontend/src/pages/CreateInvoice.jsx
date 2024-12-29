import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createInvoice, getCustomers, getTemplates } from '../services/api'
import toast from 'react-hot-toast'

export default function CreateInvoice() {
  const [formData, setFormData] = useState({
    template_id: '',
    customer_id: '',
    products: [{ name: '', qty: 1, price: 0 }],
    tax: 0,
    discount: 0,
    warranty: '',
    payment_method: 'cash',
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: customers } = useQuery(['customers'], getCustomers)
  const { data: templates } = useQuery(['templates'], getTemplates)

  const createMutation = useMutation(createInvoice, {
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices'])
      toast.success('Invoice created successfully')
      navigate('/invoices')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index][field] = value
    setFormData({ ...formData, products: updatedProducts })
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', qty: 1, price: 0 }],
    })
  }

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index)
    setFormData({ ...formData, products: updatedProducts })
  }

  const calculateTotal = () => {
    const subtotal = formData.products.reduce((sum, product) => sum + product.qty * product.price, 0)
    const taxAmount = subtotal * (formData.tax / 100)
    const total = subtotal + taxAmount - formData.discount
    return total.toFixed(2)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              id="template"
              value={formData.template_id}
              onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select a template</option>
              {templates?.map((template) => (
                <option key={template.t_id} value={template.t_id}>
                  {template.t_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              id="customer"
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select a customer</option>
              {customers?.map((customer) => (
                <option key={customer.c_id} value={customer.c_id}>
                  {customer.c_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Products</h2>
          {formData.products.map((product, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                placeholder="Product name"
                className="form-input flex-grow"
                required
              />
              <input
                type="number"
                value={product.qty}
                onChange={(e) => handleProductChange(index, 'qty', parseInt(e.target.value))}
                placeholder="Quantity"
                className="form-input w-24"
                min="1"
                required
              />
              <input
                type="number"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                placeholder="Price"
                className="form-input w-32"
                min="0"
                step="0.01"
                required
              />
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="btn-secondary"
          >
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
          <div>
            <label htmlFor="tax" className="block text-sm font-medium text-gray-700">
              Tax (%)
            </label>
            <input
              type="number"
              id="tax"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) })}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <input
              type="number"
              id="discount"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="warranty" className="block text-sm font-medium text-gray-700">
              Warranty
            </label>
            <input
              type="text"
              id="warranty"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="form-input"
            required
          >
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}