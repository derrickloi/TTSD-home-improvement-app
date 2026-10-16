import React, { useState } from 'react';
import { DESIGN_STYLES, AA_GUIDELINES } from '../data/mockData';
import { InteriorDesignStyle } from '../types';
import {
  Compass,
  FileCheck2,
  Sliders,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Calculator,
  Layers,
  Palette,
} from 'lucide-react';

interface DesignAndAAPlannerProps {
  onScopeConfigured: (scopeSummary: {
    style: string;
    propertyType: string;
    estimatedCost: number;
    selectedItems: string[];
  }) => void;
  onOpenMatchmaker: () => void;
}

export const DesignAndAAPlanner: React.FC<DesignAndAAPlannerProps> = ({
  onScopeConfigured,
  onOpenMatchmaker,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<InteriorDesignStyle>(DESIGN_STYLES[0]);
  const [propertyType, setPropertyType] = useState<'bto4' | 'bto5' | 'resale' | 'condo' | 'landed'>('bto4');
  const [activeTab, setActiveTab] = useState<'styles' | 'scope_calculator' | 'aa_permits'>('styles');

  // Scope calculator items
  const [includeHacking, setIncludeHacking] = useState(true);
  const [carpentryFootRun, setCarpentryFootRun] = useState(65);
  const [tilingBathrooms, setTilingBathrooms] = useState(2);
  const [electricalPoints, setElectricalPoints] = useState(35);
  const [includePainting, setIncludePainting] = useState(true);
  const [includeSmartHome, setIncludeSmartHome] = useState(false);
  const [includeAircon, setIncludeAircon] = useState(true);

  // Dynamic cost calculation based on realistic Singapore renovation trade benchmarks
  const baseHackingCost = includeHacking
    ? propertyType === 'resale' ? 4800 : propertyType === 'landed' ? 8500 : 2600
    : 0;
  const carpentryCost = carpentryFootRun * 220;
  const tilingCost = tilingBathrooms * 3200;
  const electricalCost = electricalPoints * 75;
  const paintingCost = includePainting ? (propertyType === 'landed' ? 3200 : 1650) : 0;
  const smartHomeCost = includeSmartHome ? 2400 : 0;
  const airconCost = includeAircon ? 3600 : 0;

  const totalCalculatedEstimate =
    baseHackingCost +
    carpentryCost +
    tilingCost +
    electricalCost +
    paintingCost +
    smartHomeCost +
    airconCost;

  const handleApplyScope = () => {
    const items: string[] = [];
    if (includeHacking) items.push('Demolition & Hacking');
    items.push(`Carpentry (${carpentryFootRun} ft run)`);
    items.push(`Tiling (${tilingBathrooms} bathrooms)`);
    items.push(`Electrical Rewiring (${electricalPoints} points)`);
    if (includePainting) items.push('Full House Painting');
    if (includeSmartHome) items.push('Smart Home Relays');
    if (includeAircon) items.push('Multi-Split Air Conditioning');

    onScopeConfigured({
      style: selectedStyle.name,
      propertyType,
      estimatedCost: totalCalculatedEstimate,
      selectedItems: items,
    });
    onOpenMatchmaker();
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Interior Design &amp; A&amp;A Planning Suite</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Design Direction, Interactive Scope &amp; A&amp;A Permits
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
              Explore curated interior architectural themes, estimate trade costs with transparency, and review statutory compliance requirements for structural alterations.
            </p>
          </div>

          {/* Interactive Navigation Filter Control */}
          <div className="flex items-center p-1 bg-stone-200/80 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('styles')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'styles'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Design Themes
            </button>
            <button
              onClick={() => setActiveTab('scope_calculator')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'scope_calculator'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Scope Estimator
            </button>
            <button
              onClick={() => setActiveTab('aa_permits')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'aa_permits'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              A&amp;A &amp; Permits Guide
            </button>
          </div>
        </div>

        {/* Tab 1: Design Styles Showcase */}
        {activeTab === 'styles' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {DESIGN_STYLES.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-white border-amber-600 shadow-md ring-1 ring-amber-600'
                        : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      {style.palette.slice(0, 3).map((col, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                    </div>
                    <div className="text-sm font-bold text-stone-900 line-clamp-1">
                      {style.name}
                    </div>
                    <div className="text-xs text-stone-500 mt-1 line-clamp-1 font-mono">
                      {style.estimatedSqftCost} psf
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Style Detail Spotlight */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span>Curated Aesthetic Portfolio</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified Specification</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                      {selectedStyle.name}
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-amber-900/80 mt-1">
                      {selectedStyle.tagline}
                    </p>
                    <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                      {selectedStyle.description}
                    </p>
                  </div>

                  {/* Material Palette */}
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                      Architectural Color Palette
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedStyle.palette.map((p, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center gap-3"
                        >
                          <div
                            className="w-8 h-8 rounded-md border border-stone-300 shrink-0"
                            style={{ backgroundColor: p.hex }}
                          />
                          <div>
                            <div className="text-xs font-semibold text-stone-800">{p.name}</div>
                            <div className="text-[11px] text-stone-400 font-mono uppercase">{p.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                      Hallmark Spatial Elements
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedStyle.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50/80 p-2.5 rounded-lg border border-stone-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Specification & Estimation Card */}
                <div className="lg:col-span-5 bg-stone-50 rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Standard Benchmark Estimates
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-stone-200">
                      <div className="text-xs text-stone-500">Estimated Rate per Square Foot</div>
                      <div className="text-2xl font-bold text-stone-900 font-mono mt-0.5">
                        {selectedStyle.estimatedSqftCost}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">Inclusive of materials &amp; skilled trade labor</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-stone-200">
                      <div className="text-xs text-stone-500">Typical Full Turnkey Renovation</div>
                      <div className="text-xl font-bold text-stone-900 font-mono mt-0.5">
                        {selectedStyle.avgFullRenoCost}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">Based on standard 4-Room / 950 sqft layout</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-stone-700 mb-1.5">Recommended Materials:</div>
                      <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                        {selectedStyle.keyMaterials.map((mat, i) => (
                          <span
                            key={i}
                            className="bg-white px-2.5 py-1 rounded-md border border-stone-200 text-stone-700"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                      <span className="font-semibold">Ideal Fit: </span>
                      {selectedStyle.idealFor}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-200">
                    <button
                      onClick={() => {
                        setActiveTab('scope_calculator');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Customize Scope for This Style</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scope & Cost Estimator */}
        {activeTab === 'scope_calculator' && (
          <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Controls */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    Transparent Itemized Scope Configurator
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Select your exact renovation requirements. Rates are calibrated directly against accredited sub-contractor tariffs.
                  </p>
                </div>

                {/* Property Type Selection */}
                <div>
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                    Property Typology
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {(
                      [
                        { id: 'bto4', label: 'BTO 4-Rm' },
                        { id: 'bto5', label: 'BTO 5-Rm' },
                        { id: 'resale', label: 'Resale HDB' },
                        { id: 'condo', label: 'Condominium' },
                        { id: 'landed', label: 'Landed / A&A' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setPropertyType(t.id)}
                        className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          propertyType === t.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope Sliders & Toggles */}
                <div className="space-y-4 pt-2">
                  {/* Demolition & Hacking */}
                  <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">Demolition &amp; Wall Hacking</div>
                      <div className="text-xs text-stone-500">Debris removal, NEA haulage permit &amp; lift lobby protection</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-stone-700 tabular-nums">
                        ${baseHackingCost.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setIncludeHacking(!includeHacking)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          includeHacking ? 'bg-amber-700' : 'bg-stone-300'
                        }`}
                        aria-label="Toggle Demolition & Wall Hacking"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            includeHacking ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Carpentry Slider */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-stone-900">Bespoke Carpentry &amp; Wardrobes</span>
                      <span className="font-mono text-stone-900 font-bold tabular-nums">
                        {carpentryFootRun} ft run · ${carpentryCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Standard E0 plywood + anti-fingerprint laminates + Blum soft-close hinges ($220/pfr avg)
                    </p>
                    <input
                      type="range"
                      min={20}
                      max={140}
                      step={5}
                      value={carpentryFootRun}
                      onChange={(e) => setCarpentryFootRun(Number(e.target.value))}
                      className="w-full accent-amber-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                      <span>20 ft (Minimalist)</span>
                      <span>65 ft (Typical 4-Rm)</span>
                      <span>140 ft (Full Storage)</span>
                    </div>
                  </div>

                  {/* Bathroom Tiling Stepper */}
                  <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">Bathroom Wet Works &amp; Retiling</div>
                      <div className="text-xs text-stone-500">3-coat waterproofing membrane + 72-hr ponding test included</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-stone-700 tabular-nums">
                        ${tilingCost.toLocaleString()}
                      </span>
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setTilingBathrooms(Math.max(0, tilingBathrooms - 1))}
                          className="px-2.5 py-1 text-sm font-bold text-stone-700 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-stone-900">
                          {tilingBathrooms}
                        </span>
                        <button
                          onClick={() => setTilingBathrooms(tilingBathrooms + 1)}
                          className="px-2.5 py-1 text-sm font-bold text-stone-700 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Electrical Points Slider */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-stone-900">Electrical &amp; Lighting Points</span>
                      <span className="font-mono text-stone-900 font-bold tabular-nums">
                        {electricalPoints} pts · ${electricalCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Concealed looping, heavy cooker isolator, EMA certified LEW sign-off ($75/pt)
                    </p>
                    <input
                      type="range"
                      min={15}
                      max={80}
                      step={5}
                      value={electricalPoints}
                      onChange={(e) => setElectricalPoints(Number(e.target.value))}
                      className="w-full accent-amber-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                      <span>15 pts</span>
                      <span>35 pts (Standard)</span>
                      <span>80 pts (Extensive)</span>
                    </div>
                  </div>

                  {/* Additional Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setIncludePainting(!includePainting)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        includePainting
                          ? 'bg-amber-50/60 border-amber-300 text-stone-900'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <div className="text-xs font-semibold">Whole House Paint</div>
                      <div className="text-xs font-mono mt-1 text-stone-700 tabular-nums">
                        ${paintingCost.toLocaleString()}
                      </div>
                    </button>

                    <button
                      onClick={() => setIncludeAircon(!includeAircon)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        includeAircon
                          ? 'bg-amber-50/60 border-amber-300 text-stone-900'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <div className="text-xs font-semibold">System 3/4 Aircon</div>
                      <div className="text-xs font-mono mt-1 text-stone-700 tabular-nums">
                        ${airconCost.toLocaleString()}
                      </div>
                    </button>

                    <button
                      onClick={() => setIncludeSmartHome(!includeSmartHome)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        includeSmartHome
                          ? 'bg-amber-50/60 border-amber-300 text-stone-900'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <div className="text-xs font-semibold">Smart Home Zigbee</div>
                      <div className="text-xs font-mono mt-1 text-stone-700 tabular-nums">
                        ${smartHomeCost.toLocaleString()}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Summary Card */}
              <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Live Cost Breakdown
                    </span>
                    <span className="text-xs text-stone-400 font-mono">SGD Currency</span>
                  </div>

                  <div className="mt-6 space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Demolition &amp; Haulage</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${baseHackingCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Carpentry ({carpentryFootRun} pfr)</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${carpentryCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Masonry &amp; Tiling ({tilingBathrooms} baths)</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${tilingCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Electrical Points ({electricalPoints} pts)</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${electricalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Painting &amp; Finishing</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${paintingCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-300">Air-Conditioning / Smart</span>
                      <span className="font-mono font-medium tabular-nums">
                        ${(airconCost + smartHomeCost).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-700">
                    <div className="text-xs text-stone-400">Estimated Project Total</div>
                    <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1 tabular-nums">
                      ${totalCalculatedEstimate.toLocaleString()}{' '}
                      <span className="text-sm font-normal text-stone-400">SGD</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      Direct sub-contractor pricing with ~25-35% savings over traditional ID firm packages.
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 space-y-3">
                  <button
                    onClick={handleApplyScope}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <span>Match Sub-contractors for This Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-stone-400 text-center">
                    Auto-fills the 4-step Matchmaker with these exact trade quantities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: A&A & Permits Guide */}
        {activeTab === 'aa_permits' && (
          <div className="mt-8 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Statutory Regulations for Additions &amp; Alterations (A&amp;A)
                </h3>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  In Singapore, all structural wall modifications, mezzanine additions, and wet area plumbing require strict adherence to BCA, HDB, and URA guidelines. TTSD only matches contractors holding validated licenses (BCA CR06, CR03, ME05, PUB LP).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AA_GUIDELINES.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-stone-700">{item.category}</span>
                      <span className="font-mono text-amber-800">{item.processingTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="text-stone-500 font-medium">
                      Authority: <span className="text-stone-800">{item.authority}</span>
                    </div>
                    <div className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>TTSD Verified Flow</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-stone-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Need a Professional Engineer (PE) Endorsement?</h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  Our network includes accredited Structural Engineers for landed home loft extensions, balcony enclosures, and commercial change-of-use.
                </p>
              </div>
              <button
                onClick={onOpenMatchmaker}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Request PE Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
