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
    (updatedItems[index][key] as any) = value; // Assert the type of the key to any
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
        <h1 className="text-2xl font-bold mb-4 text-slate-300">Create Invoice</h1>
      {items.map((item, index) => (
        <div key={index} className="mb-4">
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
                onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
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
                onChange={e => handleItemChange(index, 'cost', parseFloat(e.target.value))}
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
      <button onClick={handleAddItem} className="bg-blue-900 text-white px-4 py-2 rounded hover:text-[#fffd78] mb-4">
        Add Item
      </button>
      <div className="mb-4">
        <div className="flex mb-2">
          <span className='w-[100px]'>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex mb-2">
          <span className='w-[100px]'>VAT ({VAT_RATE * 100}%):</span>
          <span>${calculateVAT().toFixed(2)}</span>
        </div>
        <div className="flex mb-2">
          <h2 className="font-bold w-[100px]">Total:</h2>
          <h2 className="font-bold">${calculateTotal().toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
  
};



   