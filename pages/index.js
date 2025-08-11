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
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Commission Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto space-y-8 p-6">
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

        {/* Commission Rate Manager Button */}
        <div className="text-center">
          <button
            onClick={() => setShowRateManager(true)}
            className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
          >
            📊 Manage Commission Rates
          </button>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chargebacks</h2>
            {chargebacks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No chargebacks yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {chargebacks.map((cb, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingCompany ? `Edit Rates: ${editingCompany}` : 'Commission Rate Manager'}
                  </h2>
                  <button
                    onClick={() => setShowRateManager(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter percentage"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={saveRates}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Save Rates
                      </button>
                      <button
                        onClick={() => {
                          setEditingCompany('');
                          setEditingRates({ Medicare: '', 'Life/Annuities': '', ACA: '', Ancillary: '' });
                        }}
                        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
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
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                hasRates ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
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
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
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