'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Plus, Send } from 'lucide-react'

export default function CreateInvoice() {
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }])

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Invoice</h2>
        <p className="text-muted-foreground">Fill in the details to create a new invoice</p>
      </div>

      <Card className="p-6">
        <form className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input id="invoice-date" type="date" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Invoice Items</h3>
            {items.map((item, index) => (
              <div key={index} className="flex items-end space-x-4 mb-4">
                <div className="flex-grow space-y-2">
                  <Label htmlFor={`item-description-${index}`}>Description</Label>
                  <Input
                    id={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`item-quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor={`item-price-${index}`}>Price</Label>
                  <Input
                    id={`item-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">
              Total: ₹{calculateTotal().toFixed(2)}
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Invoice
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}