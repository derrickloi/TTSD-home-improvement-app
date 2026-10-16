import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Building2,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Landmark,
  UserCheck,
  Compass,
  FileCheck2,
  Info,
} from 'lucide-react';

export const GovRegistryAndGeoSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architects' | 'contractors' | 'builders' | 'onemap'>('architects');

  // Search states
  const [architectQuery, setArchitectQuery] = useState('');
  const [contractorQuery, setContractorQuery] = useState('');
  const [contractorWorkhead, setContractorWorkhead] = useState('ALL');
  const [builderQuery, setBuilderQuery] = useState('');
  const [builderClass, setBuilderClass] = useState('ALL');
  const [onemapSearchVal, setOnemapSearchVal] = useState('178903');

  // Results & loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [architectResults, setArchitectResults] = useState<any[]>([]);
  const [architectTotal, setArchitectTotal] = useState<number>(0);
  const [contractorResults, setContractorResults] = useState<any[]>([]);
  const [contractorTotal, setContractorTotal] = useState<number>(0);
  const [builderResults, setBuilderResults] = useState<any[]>([]);
  const [builderTotal, setBuilderTotal] = useState<number>(0);
  const [onemapResults, setOnemapResults] = useState<any[]>([]);

  // Fetch BOA Architects
  const fetchArchitects = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/homestyler?action=architects&q=${encodeURIComponent(query)}&limit=15`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setArchitectResults(data.results || []);
      setArchitectTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch BOA architects');
      setArchitectResults([]);
      setArchitectTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Registered Contractors
  const fetchContractors = async (query = '', workhead = 'ALL') => {
    setLoading(true);
    setError(null);
    try {
      const workheadParam = workhead === 'ALL' ? '' : workhead;
      const res = await fetch(
        `/api/homestyler?action=contractors&q=${encodeURIComponent(query)}&workhead=${encodeURIComponent(
          workheadParam
        )}&limit=15`
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setContractorResults(data.results || []);
      setContractorTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch registered contractors');
      setContractorResults([]);
      setContractorTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Licensed Builders
  const fetchBuilders = async (query = '', classCode = 'ALL') => {
    setLoading(true);
    setError(null);
    try {
      const classParam = classCode === 'ALL' ? '' : classCode;
      const res = await fetch(
        `/api/homestyler?action=builders&q=${encodeURIComponent(query)}&classCode=${encodeURIComponent(
          classParam
        )}&limit=15`
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setBuilderResults(data.results || []);
      setBuilderTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch licensed builders');
      setBuilderResults([]);
      setBuilderTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch OneMap Address Search
  const fetchOneMap = async (searchVal = '178903') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/homestyler?action=onemap&searchVal=${encodeURIComponent(searchVal)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setOnemapResults(data.data?.results || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to query OneMap SG');
      setOnemapResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (activeTab === 'architects' && architectResults.length === 0) {
      fetchArchitects();
    } else if (activeTab === 'contractors' && contractorResults.length === 0) {
      fetchContractors();
    } else if (activeTab === 'builders' && builderResults.length === 0) {
      fetchBuilders();
    } else if (activeTab === 'onemap' && onemapResults.length === 0) {
      fetchOneMap(onemapSearchVal);
    }
  }, [activeTab]);

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Singapore Government Live Verification &amp; Geocoding APIs</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Official Registries &amp; OneMap Geolocation
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Verify credentials in real time using official datasets from data.gov.sg (Board of Architects BOA, BCA Registered Contractors, BCA Licensed Builders) and SLA OneMap address resolution.
            </p>
          </div>

          {/* Interactive Navigation Filter Control */}
          <div className="flex items-center p-1 bg-stone-200/80 rounded-xl overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => setActiveTab('architects')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'architects'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              BOA Architects
            </button>
            <button
              onClick={() => setActiveTab('contractors')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'contractors'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Registered Contractors
            </button>
            <button
              onClick={() => setActiveTab('builders')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'builders'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Licensed Builders
            </button>
            <button
              onClick={() => setActiveTab('onemap')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'onemap'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              OneMap SG Geocoding
            </button>
          </div>
        </div>

        {/* Tab 1: BOA Architects */}
        {activeTab === 'architects' && (
          <div className="mt-8 space-y-6">
            {/* Live Link Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Singaporean Register of Architects, BOA (Board of Architects)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Listing of architects currently with a practicing certificate for a given year in Singapore under the Board of Architects (including local and foreign architects).
                  </p>
                </div>
              </div>

              <a
                href="https://developers.data.gov.sg/datasets/d_d77de0f78ca589a5c61da7a60fdee6ba/view"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live data.gov.sg Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchArchitects(architectQuery);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search architect by name, registration number, or firm (e.g. Aamer, 1403, ID Architects)..."
                  value={architectQuery}
                  onChange={(e) => setArchitectQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>

            <div className="text-xs text-stone-500">
              Showing <span className="font-bold text-stone-900">{architectResults.length}</span> of{' '}
              <span className="font-bold text-stone-900">{architectTotal}</span> registered practicing architects
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Architect Name</th>
                      <th className="py-3 px-4">Reg No</th>
                      <th className="py-3 px-4">Firm Name</th>
                      <th className="py-3 px-4">Firm Address</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-stone-500" />
                          <span>Pulling live records from data.gov.sg...</span>
                        </td>
                      </tr>
                    ) : architectResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          No architects found matching your search.
                        </td>
                      </tr>
                    ) : (
                      architectResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-900">{item.name}</td>
                          <td className="py-3 px-4 font-mono font-medium text-stone-700">{item.reg_no}</td>
                          <td className="py-3 px-4 text-stone-800 font-medium">{item.firm_name}</td>
                          <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{item.firm_address}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">{item.firm_phone || 'na'}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>BOA Certified</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Contractors */}
        {activeTab === 'contractors' && (
          <div className="mt-8 space-y-6">
            {/* Live Link Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Listing of Registered Contractors (BCA Contractors Registry)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Official registry of contractors classified by workhead (CR06 Interior Decoration, ME01 Aircon, ME05 Electrical, ME06 Plumbing) and financial tendering grade.
                  </p>
                </div>
              </div>

              <a
                href="https://data.gov.sg/datasets/d_dcda79be4aded5f9e769b8e23ff69b47/view"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live data.gov.sg Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Filter by Workhead + Query */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contractor by company name, UEN, or address..."
                  value={contractorQuery}
                  onChange={(e) => setContractorQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs"
                />
              </div>

              <select
                value={contractorWorkhead}
                onChange={(e) => {
                  setContractorWorkhead(e.target.value);
                  fetchContractors(contractorQuery, e.target.value);
                }}
                className="px-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 font-medium"
              >
                <option value="ALL">All Workheads</option>
                <option value="CR06">CR06 - Interior Decoration &amp; Finishing</option>
                <option value="ME01">ME01 - Air Conditioning &amp; Ventilation</option>
                <option value="ME05">ME05 - Electrical Engineering</option>
                <option value="ME06">ME06 - Fire Prevention &amp; Plumbing</option>
                <option value="CW01">CW01 - General Building</option>
              </select>

              <button
                onClick={() => fetchContractors(contractorQuery, contractorWorkhead)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </div>

            <div className="text-xs text-stone-500">
              Showing <span className="font-bold text-stone-900">{contractorResults.length}</span> of{' '}
              <span className="font-bold text-stone-900">{contractorTotal}</span> registered contractors
            </div>

            {/* Contractors Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">UEN</th>
                      <th className="py-3 px-4">Workhead &amp; Grade</th>
                      <th className="py-3 px-4">Address / Postal</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Tel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-stone-500" />
                          <span>Pulling registered contractor records...</span>
                        </td>
                      </tr>
                    ) : contractorResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          No contractors found matching this criteria.
                        </td>
                      </tr>
                    ) : (
                      contractorResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-900">{item.company_name}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">{item.uen_no}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {item.workhead} ({item.grade})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            {item.building_no} {item.street_name} {item.unit_no !== 'na' ? item.unit_no : ''} Singapore {item.postal_code}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-500">{item.expiry_date}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">{item.tel_no}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Licensed Builders */}
        {activeTab === 'builders' && (
          <div className="mt-8 space-y-6">
            {/* Live Link Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Listing of Licensed Builders (BCA Building Control Act)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Licensed builders authorized for major A&amp;A, structural demolition, piling, and ground engineering works (General Builder GB1/GB2 &amp; Specialist Builders).
                  </p>
                </div>
              </div>

              <a
                href="https://data.gov.sg/datasets/d_19573c579879be15623f2e1e3854926d/view"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live data.gov.sg Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Filter by Class + Query */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search builder by company name, UEN, or address..."
                  value={builderQuery}
                  onChange={(e) => setBuilderQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs"
                />
              </div>

              <select
                value={builderClass}
                onChange={(e) => {
                  setBuilderClass(e.target.value);
                  fetchBuilders(builderQuery, e.target.value);
                }}
                className="px-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 font-medium"
              >
                <option value="ALL">All Builder Classes</option>
                <option value="GB1">General Builder Class 1 (GB1)</option>
                <option value="GB2">General Builder Class 2 (GB2)</option>
                <option value="SB(SS)">Specialist Builder (Structural Steel)</option>
                <option value="SB(PC)">Specialist Builder (Pre-cast Concrete)</option>
              </select>

              <button
                onClick={() => fetchBuilders(builderQuery, builderClass)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </div>

            <div className="text-xs text-stone-500">
              Showing <span className="font-bold text-stone-900">{builderResults.length}</span> of{' '}
              <span className="font-bold text-stone-900">{builderTotal}</span> licensed builders
            </div>

            {/* Builders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Builder Name</th>
                      <th className="py-3 px-4">UEN</th>
                      <th className="py-3 px-4">Class &amp; Code</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-stone-500" />
                          <span>Pulling licensed builder records...</span>
                        </td>
                      </tr>
                    ) : builderResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          No builders found matching this criteria.
                        </td>
                      </tr>
                    ) : (
                      builderResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-900">{item.company_name}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">{item.uen_no}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-800">{item.class}</span>
                            <span className="ml-1 text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {item.class_code}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            {item.building_no} {item.street_name} Singapore {item.postal_code}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-500">{item.expiry_date}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">{item.tel_no}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: OneMap SG Geolocation */}
        {activeTab === 'onemap' && (
          <div className="mt-8 space-y-6">
            {/* Live Link Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    SLA OneMap Singapore Address &amp; Geocoding Endpoint
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live endpoint: <code className="font-mono text-[11px] text-amber-800">https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&amp;returnGeom=Y&amp;getAddrDetails=Y&amp;pageNum=1</code>
                  </p>
                </div>
              </div>

              <a
                href="https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live OneMap Endpoint</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchOneMap(onemapSearchVal);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Singapore postal code or building name (e.g. 178903, Marina Bay Sands, Tampines Mall)..."
                  value={onemapSearchVal}
                  onChange={(e) => setOnemapSearchVal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Locate via OneMap</span>
              </button>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 py-12 text-center text-stone-400 bg-white rounded-xl border border-stone-200">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-500" />
                  <span>Connecting to onemap.gov.sg API...</span>
                </div>
              ) : onemapResults.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-stone-400 bg-white rounded-xl border border-stone-200">
                  No address records returned for "{onemapSearchVal}".
                </div>
              ) : (
                onemapResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          OneMap Verified Property
                        </div>
                        <h4 className="text-base font-bold text-stone-900 mt-0.5">
                          {item.BUILDING !== 'NIL' ? item.BUILDING : item.ROAD_NAME}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
                        SG {item.POSTAL}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                      {item.ADDRESS}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-500 pt-1">
                      <div>
                        <span className="text-stone-400">Lat:</span> {item.LATITUDE}
                      </div>
                      <div>
                        <span className="text-stone-400">Long:</span> {item.LONGITUDE}
                      </div>
                      <div>
                        <span className="text-stone-400">X:</span> {item.X}
                      </div>
                      <div>
                        <span className="text-stone-400">Y:</span> {item.Y}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
