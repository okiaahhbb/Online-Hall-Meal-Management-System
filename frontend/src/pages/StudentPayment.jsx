import { useState } from 'react';

function StudentPayment() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for now
  const mockPayments = [
    { id: 1, date: '2026-07-20', amount: 120, status: 'paid', meal: 'Breakfast, Lunch' },
    { id: 2, date: '2026-07-21', amount: 80, status: 'pending', meal: 'Dinner' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">💳 My Payments</h2>
          <p className="text-sm text-emerald-100">View your payment history and status</p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-b border-slate-200">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-600 font-bold uppercase">Total Spent</p>
            <p className="text-2xl font-bold text-emerald-700">৳1,200</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-green-600 font-bold uppercase">Paid</p>
            <p className="text-2xl font-bold text-green-700">৳800</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-xs text-yellow-600 font-bold uppercase">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">৳400</p>
          </div>
        </div>

        {/* Payment History */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">📋 Payment History</h3>
          
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : (
            <div className="space-y-3">
              {mockPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{payment.date}</p>
                    <p className="text-xs text-slate-500">{payment.meal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">৳{payment.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {mockPayments.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-2">💰</p>
              <p>No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPayment;