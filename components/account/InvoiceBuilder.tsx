'use client';

import { useState } from 'react';

interface InvoiceItem {
  itemName: string;
  quantity: number;
  cost: number;
}

export default function InvoiceBuilder() {

  const [items, setItems] = useState<InvoiceItem[]>([{ itemName: '', quantity: 1, cost: 0 }]);
  const VAT_RATE = 0.20; // 20% VAT

  const handleItemChange = (index: number, key: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    if (key === 'quantity' && value === '') {
      value = 0;
    }
    if (key === 'cost' && value === '') {
      value = 0;
    }
    (updatedItems[index][key] as any) = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', quantity: 1, cost: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return; // Prevent removing the last item
    const updatedItems = [...items.slice(0, index), ...items.slice(index + 1)];
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.cost, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * VAT_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div>
          <img src="/logo.png" alt="Company Logo" className="w-24 h-24 mb-2" />
          <div className="font-bold text-xl">Your Company Name</div>
          <div>1234 Street Address</div>
          <div>City, ST 56789</div>
          <div>Email: info@yourcompany.com</div>
          <div>Phone: (123) 456-7890</div>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <div className="mt-4">
            <div><strong>Invoice #: </strong> INV-0001</div>
            <div><strong>Invoice Date: </strong> October 10, 2024</div>
          </div>
          <div className="mt-4">
            <h2 className="font-bold">Customer Name</h2>
            <div>5678 Customer St.</div>
            <div>Customer City, ST 12345</div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <label htmlFor={`itemName-${index}`} className="block mb-2 font-bold">
            Item Name
          </label>
          <input
            type="text"
            id={`itemName-${index}`}
            placeholder="Item Name"
            className="w-full border p-2 mb-2"
            value={item.itemName}
            onChange={e => handleItemChange(index, 'itemName', e.target.value)}
          />
          <div className="flex justify-between mb-2">
            <div className="w-1/2">
              <label htmlFor={`quantity-${index}`} className="block mb-2 font-bold">
                Quantity
              </label>
              <input
                type="number"
                id={`quantity-${index}`}
                placeholder="Quantity"
                min="1"
                className="w-full border p-2 mr-2"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value))}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor={`cost-${index}`} className="block mb-2 font-bold">
                Cost (£)
              </label>
              <input
                type="number"
                id={`cost-${index}`}
                placeholder="Cost"
                min="0"
                step="0.01"
                className="w-full border p-2"
                value={item.cost}
                onChange={e => handleItemChange(index, 'cost', e.target.value === '' ? 0 : parseFloat(e.target.value))}
              />
            </div>
            {index !== 0 && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:text-[#fffd78] ml-2 h-1/2 mt-auto"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Item and Totals Section */}
      <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div className="flex justify-end mb-4">
          <button onClick={handleAddItem} className="bg-blue-900 text-white px-4 py-2 rounded hover:text-[#fffd78]">
            Add Item
          </button>
        </div>
        <div className="flex justify-end mb-2">
          <span className='w-[100px] text-left'>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-end mb-2">
          <span className='w-[100px] text-left'>VAT ({VAT_RATE * 100}%):</span>
          <span>${calculateVAT().toFixed(2)}</span>
        </div>
        <div className="flex justify-end">
          <h2 className="font-bold w-[100px] text-left">Total:</h2>
          <h2 className="font-bold">${calculateTotal().toFixed(2)}</h2>
        </div>

        {/* Send Button */}
        <div className="flex justify-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
