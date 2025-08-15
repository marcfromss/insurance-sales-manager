import { useState, useEffect } from 'react';

const defaultCommissionRates = {
  // Existing Carriers
  Aetna: { Medicare: 0.1, 'Life/Annuities': 0.12, ACA: 0.08, Ancillary: 0.11 },
  'State Farm': { Medicare: 0.09, 'Life/Annuities': 0.15, ACA: 0.07, Ancillary: 0.1 },
  'Liberty Mutual': { Medicare: 0.08, 'Life/Annuities': 0.1, ACA: 0.06, Ancillary: 0.12 },
  
  // Ancillary
  Ancillary: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  AFLac: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'AllState (Dental)': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Ameritas: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Assurity: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Healthspring: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Combined: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Direct Vision': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  EyeMed: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  GTL: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Heartland Fin\'l': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Humana: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Mut. of Omaha': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Pekin: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Spirit: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  VSP: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Wtl. Wellabe': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  
  // Life / Annuities
  'Mutual of Omaha': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Alfa AFLac': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'American Amicable': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Ameritas Life': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Assurity Life': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Aetna Life': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Foresters: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Gerber: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'GTL Life': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'NLG (Nat\'l Life Group)': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Core Bridge (AIG & W&S)': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'F&G': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Royal Neighbors': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Silac: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Baltimore Life': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  
  // Medicare
  'Aetna Medicare': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Anthem: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'CareSource DSNP': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Healthspring Medicare': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Clear Spring': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Clover: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Devoted: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Humana Medicare': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Kaiser: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'Pruitt BNP': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  Sonder: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  'United Health': { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' },
  WellCare: { Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' }
};

const companies = Object.keys(defaultCommissionRates);
const policyTypes = ['Medicare', 'Life/Annuities', 'ACA', 'Ancillary'];

export default function Home() {
  const [form, setForm] = useState({ client: '', company: '', type: '', value: '', date: '' });
  const [chargebackForm, setChargebackForm] = useState({ client: '', reason: '', amount: '', date: '' });
  const [commission, setCommission] = useState(null);
  const [entries, setEntries] = useState([]);
  const [chargebacks, setChargebacks] = useState([]);
  const [commissionRates, setCommissionRates] = useState(defaultCommissionRates);
  const [showRateManager, setShowRateManager] = useState(false);
  const [editingCompany, setEditingCompany] = useState('');
  const [editingRates, setEditingRates] = useState({ Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      const savedEntries = localStorage.getItem('entries');
      const savedChargebacks = localStorage.getItem('chargebacks');
      const savedRates = localStorage.getItem('commissionRates');
      
      if (savedEntries) {
        const parsed = JSON.parse(savedEntries);
        setEntries(Array.isArray(parsed) ? parsed : []);
      }
      if (savedChargebacks) {
        const parsed = JSON.parse(savedChargebacks);
        setChargebacks(Array.isArray(parsed) ? parsed : []);
      }
      if (savedRates) {
        const parsed = JSON.parse(savedRates);
        setCommissionRates(parsed && typeof parsed === 'object' ? parsed : defaultCommissionRates);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      // Use defaults if there's an error
      setEntries([]);
      setChargebacks([]);
      setCommissionRates(defaultCommissionRates);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (entries.length > 0) {
        localStorage.setItem('entries', JSON.stringify(entries));
      }
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  }, [entries]);

  useEffect(() => {
    try {
      if (chargebacks.length > 0) {
        localStorage.setItem('chargebacks', JSON.stringify(chargebacks));
      }
    } catch (error) {
      console.error('Error saving chargebacks:', error);
    }
  }, [chargebacks]);

  useEffect(() => {
    try {
      localStorage.setItem('commissionRates', JSON.stringify(commissionRates));
    } catch (error) {
      console.error('Error saving commission rates:', error);
    }
  }, [commissionRates]);

  const calculate = () => {
    try {
      const value = parseFloat(form.value);
      if (isNaN(value) || value <= 0) {
        alert('Please enter a valid policy value.');
        return;
      }

      const rate = commissionRates[form.company]?.[form.type];
      
      // Check if rate is empty or invalid
      if (!rate || rate === '' || isNaN(rate)) {
        alert('Please set a commission rate for this company and policy type first.');
        return;
      }
      
      const earned = value * rate;
      setCommission({ percent: rate * 100, earned });
      const entry = { ...form, percent: rate * 100, earned, value };
      setEntries([entry, ...entries]);
      setForm({ client: '', company: '', type: '', value: '', date: '' });
    } catch (error) {
      console.error('Error calculating commission:', error);
      alert('An error occurred while calculating the commission. Please try again.');
    }
  };

  const logChargeback = () => {
    try {
      const amount = parseFloat(chargebackForm.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid chargeback amount.');
        return;
      }

      const cb = { ...chargebackForm, amount };
      setChargebacks([cb, ...chargebacks]);
      setChargebackForm({ client: '', reason: '', amount: '', date: '' });
    } catch (error) {
      console.error('Error logging chargeback:', error);
      alert('An error occurred while logging the chargeback. Please try again.');
    }
  };

  const openRateEditor = (company) => {
    try {
      setEditingCompany(company);
      setEditingRates({ ...commissionRates[company] });
      setShowRateManager(true);
    } catch (error) {
      console.error('Error opening rate editor:', error);
      alert('An error occurred while opening the rate editor. Please try again.');
    }
  };

  const saveRates = () => {
    try {
      const newRates = { ...commissionRates };
      newRates[editingCompany] = editingRates;
      setCommissionRates(newRates);
      setShowRateManager(false);
      setEditingCompany('');
      setEditingRates({ Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' });
    } catch (error) {
      console.error('Error saving rates:', error);
      alert('An error occurred while saving the rates. Please try again.');
    }
  };

  const safeCalculateTotal = (items, key) => {
    try {
      return items.reduce((sum, item) => {
        const value = item[key];
        return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  };

  const totalEarned = safeCalculateTotal(entries, 'earned');
  const totalChargebacks = safeCalculateTotal(chargebacks, 'amount');
  const netEarnings = totalEarned - totalChargebacks;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">
            <h1 className="text-brand-primary font-heading text-4xl font-semibold mb-1">Here is the Insurance Lady</h1>
            <p className="text-slate-700 font-medium">Your protection, our priority — trusted insurance for every stage of life.</p>
          </div>
          <p className="mt-4 text-slate-600">Loading Commission Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-5xl font-semibold text-brand-primary">Here is the Insurance Lady</h1>
          <p className="mt-3 text-slate-700">Your protection, our priority — trusted insurance for every stage of life.</p>
        </div>

        {/* Commission Tracker Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-700">Commission Tracker</h2>
          <p className="text-gray-600 mt-2">Professional commission management for insurance professionals</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Total Earned</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-lg">📉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Total Chargebacks</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">${totalChargebacks.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Net Earnings</h3>
            </div>
            <p className={`text-3xl font-bold ${netEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Commission Rate Manager Button */}
        <div className="text-center">
          <button
            onClick={() => setShowRateManager(true)}
            className="bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-4 px-8 rounded-lg hover:from-brand-primaryDark hover:to-brand-primaryDark transition-all duration-300 text-lg font-semibold shadow-lg transform hover:scale-105"
          >
            💎 Manage Commission Rates
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commission Calculator */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-brand-primary">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mr-3">
                <span className="text-brand-primary text-xl">🧮</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Commission Calculator</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => setForm({...form, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                <select
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                >
                  <option value="">Select company</option>
                  <optgroup label="Existing Carriers">
                    {companies.slice(0, 3).map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Ancillary">
                    {companies.slice(3, 21).map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Life / Annuities">
                    {companies.slice(21, 36).map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Medicare">
                    {companies.slice(36).map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Enter policy value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              
              <button
                onClick={calculate}
                disabled={!form.client || !form.company || !form.type || !form.value || !form.date}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-3 px-4 rounded-md hover:from-brand-primaryDark hover:to-brand-primaryDark disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md"
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
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-brand-primary">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mr-3">
                <span className="text-brand-primary text-xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Log Chargeback</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={chargebackForm.client}
                  onChange={(e) => setChargebackForm({...chargebackForm, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={chargebackForm.reason}
                  onChange={(e) => setChargebackForm({...chargebackForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Enter chargeback reason"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={chargebackForm.amount}
                  onChange={(e) => setChargebackForm({...chargebackForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="Enter chargeback amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={chargebackForm.date}
                  onChange={(e) => setChargebackForm({...chargebackForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              
              <button
                onClick={logChargeback}
                disabled={!chargebackForm.client || !chargebackForm.reason || !chargebackForm.amount || !chargebackForm.date}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-3 px-4 rounded-md hover:from-brand-primaryDark hover:to-brand-primaryDark disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md"
              >
                Log Chargeback
              </button>
            </div>
          </div>
        </div>

        {/* Entries and Chargebacks Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commission Entries */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-brand-secondary">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Commission Entries</h2>
            </div>
            {entries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No entries yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{entry.client || 'Unknown Client'}</h3>
                      <span className="text-green-600 font-bold">${(entry.earned || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Company:</span> {entry.company || 'Unknown'}</p>
                      <p><span className="font-medium">Type:</span> {entry.type || 'Unknown'}</p>
                      <p><span className="font-medium">Value:</span> ${(entry.value || 0).toFixed(2)}</p>
                      <p><span className="font-medium">Rate:</span> {(entry.percent || 0).toFixed(1)}%</p>
                      <p><span className="font-medium">Date:</span> {entry.date || 'Unknown'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chargebacks */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-brand-secondary">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Chargebacks</h2>
            </div>
            {chargebacks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No chargebacks yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {chargebacks.map((cb, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{cb.client || 'Unknown Client'}</h3>
                      <span className="text-red-600 font-bold">-${(cb.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Reason:</span> {cb.reason || 'Unknown'}</p>
                      <p><span className="font-medium">Date:</span> {cb.date || 'Unknown'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Commission Rate Manager Modal */}
        {showRateManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3">
                      <svg
                        role="img"
                        aria-label="Diamond Coverage icon"
                        width="32"
                        height="32"
                        viewBox="0 0 200 160"
                        className="drop-shadow"
                      >
                        <defs>
                          <linearGradient id="gemRedModal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff3a3a" />
                            <stop offset="100%" stopColor="#b10000" />
                          </linearGradient>
                        </defs>

                        {/* Outer gem */}
                        <polygon
                          points="10,60 60,10 140,10 190,60 100,150"
                          fill="url(#gemRedModal)"
                        />

                        {/* Facet lines (white) */}
                        <g
                          stroke="#ffffff"
                          strokeWidth="8"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          opacity="0.95"
                        >
                          <line x1="10" y1="60" x2="190" y2="60" />
                          <line x1="60" y1="10" x2="100" y2="60" />
                          <line x1="140" y1="10" x2="100" y2="60" />
                          <line x1="100" y1="60" x2="100" y2="150" />
                        </g>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {editingCompany ? `Edit Rates: ${editingCompany}` : 'Commission Rate Manager'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowRateManager(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                {editingCompany ? (
                  // Edit specific company rates
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Set Commission Rates for {editingCompany}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {policyTypes.map(type => (
                        <div key={type}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{type} (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={editingRates[type] ? editingRates[type] * 100 : ''}
                            onChange={(e) => {
                              try {
                                const value = e.target.value;
                                setEditingRates({
                                  ...editingRates,
                                  [type]: value ? parseFloat(value) / 100 : ''
                                });
                              } catch (error) {
                                console.error('Error updating rate:', error);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Enter percentage"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={saveRates}
                        className="bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-2 px-4 rounded-md hover:from-brand-primaryDark hover:to-brand-primaryDark transition-all duration-300 font-semibold"
                      >
                        Save Rates
                      </button>
                      <button
                        onClick={() => {
                          setEditingCompany('');
                          setEditingRates({ Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' });
                        }}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show all companies with rates
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companies.map(company => {
                        try {
                          const rates = commissionRates[company] || {};
                          const hasRates = Object.values(rates).some(rate => rate !== '' && rate !== null);
                          return (
                            <div
                              key={company}
                              className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                hasRates ? 'border-green-300 bg-green-50 hover:bg-green-100' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                              }`}
                              onClick={() => openRateEditor(company)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800 text-sm">{company}</h4>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  hasRates ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {hasRates ? 'Rates Set' : 'No Rates'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                {policyTypes.map(type => (
                                  <div key={type} className="flex justify-between">
                                    <span>{type}:</span>
                                    <span className="font-medium">
                                      {rates[type] ? `${(rates[type] * 100).toFixed(1)}%` : 'Not set'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.error('Error rendering company:', company, error);
                          return null;
                        }
                      })}
                    </div>
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Click on any company to set or edit their commission rates
                      </p>
                      <button
                        onClick={() => setShowRateManager(false)}
                        className="bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-2 px-6 rounded-md hover:from-brand-primaryDark hover:to-brand-primaryDark transition-all duration-300 font-semibold"
                      >
                        Close Manager
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 