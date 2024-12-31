'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Check } from 'lucide-react'

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Sample data - will be replaced with actual API data
  const templates = [
    {
      id: 1,
      name: 'Professional',
      thumbnail: '/placeholder.svg?height=200&width=300',
      isPremium: false
    },
    {
      id: 2,
      name: 'Modern',
      thumbnail: '/placeholder.svg?height=200&width=300',
      isPremium: true
    },
    {
      id: 3,
      name: 'Classic',
      thumbnail: '/placeholder.svg?height=200&width=300',
      isPremium: false
    },
    // Add more templates
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoice Templates</h2>
          <p className="text-muted-foreground">Choose a template for your invoices</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Template
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            {template.isPremium && (
              <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                Premium
              </div>
            )}
            <img
              src={template.thumbnail}
              alt={template.name}
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{template.name}</h3>
                {selectedTemplate === template.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}