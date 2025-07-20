'use client';
import { useState, useEffect } from 'react';

const commissionRates = {
  Aetna: { Auto: 0.1, Life: 0.12, Health: 0.08, Property: 0.11 },
  'State Farm': { Auto: 0.09, Life: 0.15, Health: 0.07, Property: 0.1 },
  'Liberty Mutual': { Auto: 0.08, Life: 0.1, Health: 0.06, Property: 0.12 },
};

const companies = Object.keys(commissionRates);
const policyTypes = ['Auto', 'Life', 'Health', 'Property'];

export default function Home() {
  const [form, setForm] = useState({ client: '', company: '', type: '', value: '', date: '' });
  const [chargebackForm, setChargebackForm] = useState({ client: '', reason: '', amount: '', date: '' });
  const [commission, setCommission] = useState(null);
  const [entries, setEntries] = useState([]);
  const [chargebacks, setChargebacks] = useState([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('entries');
    const savedChargebacks = localStorage.getItem('chargebacks');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedChargebacks) setChargebacks(JSON.parse(savedChargebacks));
  }, []);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('chargebacks', JSON.stringify(chargebacks));
  }, [chargebacks]);

  const calculate = () => {
    const value = parseFloat(form.value);
    const rate = commissionRates[form.company]?.[form.type] || 0;
    const earned = value * rate;
    setCommission({ percent: rate * 100, earned });
    const entry = { ...form, percent: rate * 100, earned, value };
    setEntries([entry, ...entries]);
    setForm({ client: '', company: '', type: '', value: '', date: '' });
  };

  const logChargeback = () => {
    const cb = { ...chargebackForm, amount: parseFloat(chargebackForm.amount) };
    setChargebacks([cb, ...chargebacks]);
    setChargebackForm({ client: '', reason: '', amount: '', date: '' });
  };

  const totalEarned = entries.reduce((sum, entry) => sum + entry.earned, 0);
  const totalChargebacks = chargebacks.reduce((sum, cb) => sum + cb.amount, 0);
  const netEarnings = totalEarned - totalChargebacks;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-6xl mx-auto space-y-8 p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Commission Tracker</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Earned</h3>
            <p className="text-3xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Chargebacks</h3>
            <p className="text-3xl font-bold text-red-600">${totalChargebacks.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Earnings</h3>
            <p className={`text-3xl font-bold ${netEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commission Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Commission Calculator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => setForm({...form, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                <select
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select company</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select policy type</option>
                  {policyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Value ($)</label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({...form, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter policy value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={calculate}
                disabled={!form.client || !form.company || !form.type || !form.value || !form.date}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Calculate Commission
              </button>
            </div>
            
            {commission && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Commission Result</h3>
                <p className="text-green-700">Rate: {commission.percent}%</p>
                <p className="text-green-700 font-bold">Earned: ${commission.earned.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Chargeback Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Log Chargeback</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={chargebackForm.client}
                  onChange={(e) => setChargebackForm({...chargebackForm, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={chargebackForm.reason}
                  onChange={(e) => setChargebackForm({...chargebackForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter chargeback reason"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={chargebackForm.amount}
                  onChange={(e) => setChargebackForm({...chargebackForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter chargeback amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={chargebackForm.date}
                  onChange={(e) => setChargebackForm({...chargebackForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={logChargeback}
                disabled={!chargebackForm.client || !chargebackForm.reason || !chargebackForm.amount || !chargebackForm.date}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Log Chargeback
              </button>
            </div>
          </div>
        </div>

        {/* Entries and Chargebacks Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commission Entries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Commission Entries</h2>
            {entries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No entries yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{entry.client}</h3>
                      <span className="text-green-600 font-bold">${entry.earned.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Company:</span> {entry.company}</p>
                      <p><span className="font-medium">Type:</span> {entry.type}</p>
                      <p><span className="font-medium">Value:</span> ${entry.value.toFixed(2)}</p>
                      <p><span className="font-medium">Rate:</span> {entry.percent}%</p>
                      <p><span className="font-medium">Date:</span> {entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chargebacks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chargebacks</h2>
            {chargebacks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No chargebacks yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {chargebacks.map((cb, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{cb.client}</h3>
                      <span className="text-red-600 font-bold">-${cb.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Reason:</span> {cb.reason}</p>
                      <p><span className="font-medium">Date:</span> {cb.date}</p>
                    </div>
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