import { useState } from 'react';

export default function Payments() {
  const [payments] = useState([
    { id: 1, date: '2026-07-20', amount: 120, status: 'paid', meal: 'Breakfast, Lunch' },
    { id: 2, date: '2026-07-21', amount: 80, status: 'pending', meal: 'Dinner' },
  ]);

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100/80 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3">
          <h2 className="text-base font-bold text-white">💳 My Payments</h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <p className="text-[10px] text-green-600 font-bold uppercase">Total Paid</p>
              <p className="text-xl font-bold text-green-700">৳{totalPaid}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
              <p className="text-[10px] text-yellow-600 font-bold uppercase">Pending</p>
              <p className="text-xl font-bold text-yellow-700">৳{totalPending}</p>
            </div>
          </div>

          <h3 className="text-xs font-bold text-gray-700 mb-2">📋 Payment History</h3>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{p.date}</p>
                  <p className="text-[10px] text-gray-500">{p.meal}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">৳{p.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">No payment history</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}