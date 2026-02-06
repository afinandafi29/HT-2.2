import React from 'react';

const plans = [
  {
    id: 'green',
    name: 'Premium 🟢 GREEN PLAN (Level 1 – Starter)',
    price: '₹99/month',
    highlights: [
      'Access to all public chat rooms',
      'Standard text chat',
      'Basic emojis & reactions',
      'Daily bonus features',
      'Standard profile theme customization',
      'Ability to send voice messages'
    ]
  },
  {
    id: 'yellow',
    name: '🟡 YELLOW PLAN (Level 2 – Advanced)',
    price: '₹299/month',
    highlights: [
      'Everything in GREEN Plan',
      'Priority room joining',
      'Premium emojis & reactions',
      'Special profile badge (Yellow)'
    ]
  },
  {
    id: 'blue',
    name: '🔵 BLUE PLAN (Level 3 – Premium)',
    price: '₹999/month',
    highlights: [
      'Everything in YELLOW Plan',
      'Blue profile badge (Premium VIP)',
      'Full access to all rooms, including semi-private',
      'Room spotlight feature'
    ]
  }
];

const sampleGifts = [
  { id: 1, name: 'Rose Sticker', price: 9 },
  { id: 2, name: 'Coffee Bundle (x5)', price: 49 },
  { id: 3, name: 'Sparkle Gift', price: 199 }
];

const PremiumModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 max-w-3xl p-6 shadow-xl">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold">Premium Plans</h2>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="p-4 rounded-lg border">
              <h3 className="font-bold">{plan.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{plan.price}</p>
              <ul className="mt-2 text-sm list-disc list-inside">
                {plan.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
              <div className="mt-4">
                <button className="px-3 py-1 rounded bg-blue-600 text-white">Subscribe</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">Gifts & Bundles</h4>
          <div className="mt-2 flex gap-4">
            {sampleGifts.map(g => (
              <div key={g.id} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-gray-600">₹{g.price}</div>
                <div className="mt-2"><button className="text-sm text-blue-600">Send Gift</button></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
