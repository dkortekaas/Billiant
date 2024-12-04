'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { InvoiceForm } from '@/components/InvoiceForm';
import { Card } from '@/components/ui/card';

interface Invoice {
  id: string;
  description: string;
  amount: number;
  date: string;
  paid: boolean;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchInvoices();
    }
  }, [status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Freelancer Invoice System</h1>
      <p className="mb-6">Welcome, {session?.user?.name || session?.user?.email}</p>
      
      <InvoiceForm onSubmit={async (data) => {
        try {
          const response = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) throw new Error('Failed to create invoice');
          
          const newInvoice = await response.json();
          setInvoices([newInvoice, ...invoices]);
        } catch (error) {
          console.error('Error creating invoice:', error);
        }
      }} />

      <Card className="p-4">
        <h2 className="text-xl mb-4">Your Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="p-2">{invoice.description}</td>
                  <td className="p-2 text-right">$ {invoice.amount.toFixed(2)}</td>
                  <td className="p-2">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                      invoice.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}