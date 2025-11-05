'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrownSugarLogo from '@/components/BrownSugarLogo';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({});

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingId(template.id);
    setFormData(template);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`/api/templates/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingId(null);
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const response = await fetch(`/api/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          is_active: !template.is_active,
        }),
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleCreateSample = async () => {
    try {
      const response = await fetch('/api/templates/create-sample', {
        method: 'POST',
      });

      if (response.ok) {
        fetchTemplates();
        alert('Sample email template created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create template'}`);
      }
    } catch (error) {
      console.error('Error creating sample template:', error);
      alert('Failed to create sample template. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95" style={{ minHeight: '175px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-8" style={{ minHeight: '175px' }}>
            <div className="flex items-center space-x-6">
              <BrownSugarLogo size={175} />
              <div>
                <h1 className="text-brown-sugar-brown text-4xl font-bold leading-tight tracking-tight">
                  Brown Sugar Bakery
                </h1>
                <p className="text-brown-sugar-brown/70 text-lg font-medium mt-1">
                  Chicago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 text-brown-sugar-brown/70 hover:text-brown-sugar-brown hover:bg-brown-sugar-orange-light/30 rounded-lg transition-all duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-3 text-brown-sugar-brown/70 hover:text-brown-sugar-brown hover:bg-brown-sugar-orange-light/30 rounded-lg transition-all duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="p-3 text-brown-sugar-brown/70 hover:text-brown-sugar-brown hover:bg-brown-sugar-orange-light/30 rounded-lg transition-all duration-200 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-brown-sugar-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm">0</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-gray-100">
            <div className="flex items-center space-x-1 py-2">
              <Link
                href="/"
                className="text-brown-sugar-brown/70 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-brown-sugar-orange-light/20 hover:text-brown-sugar-brown transition-all duration-200"
              >
                Sent Emails
              </Link>
              <Link
                href="/templates"
                className="text-brown-sugar-brown font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-brown-sugar-orange-light/20 transition-all duration-200 relative"
              >
                <span className="relative z-10">Email Templates</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brown-sugar-orange rounded-t-full"></span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-brown-sugar-orange to-brown-sugar-orange-dark px-8 py-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Email Templates
              </h2>
              <p className="text-white/90 text-sm font-medium">
                Configure email templates for pickup notifications. Use variables like {'{{customer_name}}'}, {'{{order_number}}'}, and {'{{order_id}}'}.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="border-t border-gray-100">
            {loading ? (
              <div className="px-8 py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brown-sugar-orange border-t-transparent"></div>
                <p className="mt-4 text-brown-sugar-brown/70 font-medium">Loading templates...</p>
              </div>
            ) : !templates || templates.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-sugar-orange-light/20 mb-4">
                  <svg className="w-8 h-8 text-brown-sugar-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-brown-sugar-brown/80 font-medium text-lg mb-2">No templates found</p>
                <p className="text-gray-500 text-sm mb-6">Create your first email template to get started</p>
                <button
                  onClick={handleCreateSample}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-semibold rounded-xl text-white bg-brown-sugar-brown hover:bg-brown-sugar-brown-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Sample Template
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {templates.map((template) => (
                  <div key={template.id} className="px-8 py-6 hover:bg-gray-50/50 transition-colors duration-150">
                    {editingId === template.id ? (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Template Name
                          </label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brown-sugar-orange focus:border-brown-sugar-orange text-sm transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={formData.subject || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brown-sugar-orange focus:border-brown-sugar-orange text-sm transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            HTML Body
                          </label>
                          <textarea
                            rows={10}
                            value={formData.body_html || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, body_html: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brown-sugar-orange focus:border-brown-sugar-orange text-sm font-mono transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Plain Text Body
                          </label>
                          <textarea
                            rows={10}
                            value={formData.body_text || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, body_text: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brown-sugar-orange focus:border-brown-sugar-orange text-sm font-mono transition-all duration-200"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_active ?? false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                is_active: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-brown-sugar-orange focus:ring-brown-sugar-orange border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm font-medium text-gray-700">
                            Active
                          </label>
                        </div>
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={handleSave}
                            className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-brown-sugar-brown hover:bg-brown-sugar-brown-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange transition-all duration-200"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-900">
                                {template.name}
                              </h4>
                              {template.is_active && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              Subject: {template.subject}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleActive(template)}
                              className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange transition-all duration-200`}
                            >
                              {template.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleEdit(template)}
                              className="inline-flex items-center px-4 py-2 border border-brown-sugar-brown shadow-sm text-sm font-semibold rounded-xl text-brown-sugar-brown bg-white hover:bg-brown-sugar-orange-light/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-semibold rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">HTML Preview</p>
                            <div className="text-sm text-gray-700 max-h-40 overflow-auto rounded-lg bg-white p-3 border border-gray-200">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: template.body_html.substring(0, 200) + '...',
                                }}
                              />
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Text Preview</p>
                            <div className="text-sm text-gray-700 max-h-40 overflow-auto rounded-lg bg-white p-3 border border-gray-200 whitespace-pre-wrap font-mono">
                              {template.body_text.substring(0, 200)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
