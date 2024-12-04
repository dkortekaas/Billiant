'use client';

import { Card } from '@/components/ui/card';

interface Props {
  onSubmit: (data: {
    description: string;
    amount: number;
    date: string;
  }) => void;
}

export function InvoiceForm({ onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
    });

    e.currentTarget.reset();
  };

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-xl mb-4">New Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            step="0.01"
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            className="p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Invoice
        </button>
      </form>
    </Card>
  );
}