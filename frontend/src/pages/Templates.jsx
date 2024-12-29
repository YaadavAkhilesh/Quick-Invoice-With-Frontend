import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../services/api'
import toast from 'react-hot-toast'

export default function Templates() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
  })

  const queryClient = useQueryClient()
  const { data: templates, isLoading } = useQuery(['templates'], getTemplates)

  const createMutation = useMutation(createTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(['templates'])
      toast.success('Template created successfully')
      handleCloseModal()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  const updateMutation = useMutation(
    ({ id, data }) => updateTemplate(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['templates'])
        toast.success('Template updated successfully')
        handleCloseModal()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'An error occurred')
      },
    }
  )

  const deleteMutation = useMutation(deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(['templates'])
      toast.success('Template deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  const handleOpenModal = (template = null) => {
    setSelectedTemplate(template)
    if (template) {
      setFormData({
        name: template.t_name,
        content: template.t_content,
      })
    } else {
      setFormData({
        name: '',
        content: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTemplate(null)
    setFormData({
      name: '',
      content: '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedTemplate) {
      updateMutation.mutate({
        id: selectedTemplate.t_id,
        data: formData,
      })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoice templates including their name and preview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary"
          >
            Add template
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.t_id}
            className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="flex-1 flex flex-col p-8">
              <h3 className="mt-6 text-gray-900 text-sm font-medium">{template.t_name}</h3>
              <dl className="mt-1 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Preview</dt>
                <dd className="text-gray-500 text-sm">{template.t_content.substring(0, 100)}...</dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="w-0 flex-1 flex">
                  <button
                    onClick={() => handleOpenModal(template)}
                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                  >
                    Edit
                  </button>
                </div>
                <div className="-ml-px w-0 flex-1 flex">
                  <button
                    onClick={() => deleteMutation.mutate(template.t_id)}
                    className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              {selectedTemplate ? 'Edit Template' : 'Add Template'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Saving...'
                    : selectedTemplate
                    ? 'Save Changes'
                    : 'Add Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}