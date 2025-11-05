'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { format, startOfToday, startOfWeek, startOfMonth } from 'date-fns';
import BrownSugarLogo from '@/components/BrownSugarLogo';

interface SentEmail {
  id: string;
  order_id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  sent_at: string;
  subject: string;
  status: string;
  error_message?: string;
}

type TimeFilter = 'all' | 'today' | 'week' | 'month';

export default function Home() {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [allEmails, setAllEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<TimeFilter>('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails?limit=1000');
      const data = await response.json();
      setAllEmails(data.emails || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setAllEmails([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const filterEmails = useCallback(() => {
    if (filter === 'all') {
      setEmails(allEmails);
      return;
    }

    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'today':
        startDate = startOfToday();
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = allEmails.filter((email) => {
      const emailDate = new Date(email.sent_at);
      // Include emails that are on or after the start date
      return emailDate >= startDate && emailDate <= now;
    });

    setEmails(filtered);
  }, [filter, allEmails]);

  useEffect(() => {
    filterEmails();
  }, [filterEmails]);

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
                className="text-brown-sugar-brown font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-brown-sugar-orange-light/20 transition-all duration-200 relative"
              >
                <span className="relative z-10">Sent Emails</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brown-sugar-orange rounded-t-full"></span>
              </Link>
              <Link
                href="/templates"
                className="text-brown-sugar-brown/70 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-brown-sugar-orange-light/20 hover:text-brown-sugar-brown transition-all duration-200"
              >
                Email Templates
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Sent Emails
                </h2>
                <p className="text-white/90 text-sm font-medium">
                  View all pickup notification emails sent to customers
                </p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
                <div className="text-brown-sugar-brown text-sm font-medium mb-1">Total Emails</div>
                <div className="text-brown-sugar-brown text-2xl font-bold">{filter === 'all' ? total : emails.length}</div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-700">Filter by:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-brown-sugar-brown text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    filter === 'today'
                      ? 'bg-brown-sugar-brown text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter('week')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    filter === 'week'
                      ? 'bg-brown-sugar-brown text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setFilter('month')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    filter === 'month'
                      ? 'bg-brown-sugar-brown text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="border-t border-gray-100">
            {loading ? (
              <div className="px-8 py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brown-sugar-orange border-t-transparent"></div>
                <p className="mt-4 text-brown-sugar-brown/70 font-medium">Loading emails...</p>
              </div>
            ) : !emails || emails.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-sugar-orange-light/20 mb-4">
                  <svg className="w-8 h-8 text-brown-sugar-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-brown-sugar-brown/80 font-medium text-lg">No emails sent yet</p>
                <p className="text-gray-500 text-sm mt-1">Emails will appear here once sent</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-brown-sugar-brown uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-brown-sugar-brown uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-brown-sugar-brown uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-brown-sugar-brown uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-brown-sugar-brown uppercase tracking-wider">
                        Sent At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {emails.map((email) => (
                      <tr key={email.id} className="hover:bg-brown-sugar-orange-light/5 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-brown-sugar-brown">
                            {email.order_number}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">
                            {email.order_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {email.customer_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {email.customer_email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {email.subject}
                          </div>
                          {email.error_message && (
                            <div className="text-xs text-red-600 mt-1.5 font-medium">
                              {email.error_message}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                              email.status === 'sent'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {email.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {format(new Date(email.sent_at), 'MMM d, yyyy h:mm a')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

