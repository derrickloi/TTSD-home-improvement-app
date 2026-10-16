import React, { useState, useMemo } from 'react';
import { LOAN_PRODUCTS } from '../data/mockData';
import { LoanProduct } from '../types';
import confetti from 'canvas-confetti';
import {
  BadgeDollarSign,
  Calculator,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Clock,
  Sparkles,
  Percent,
  Landmark,
} from 'lucide-react';

interface FinanceAndLoansMarketplaceProps {
  onApplyForLoan?: (loan: LoanProduct, amount: number, tenure: number) => void;
}

export const FinanceAndLoansMarketplace: React.FC<FinanceAndLoansMarketplaceProps> = ({
  onApplyForLoan,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(35000);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>(LOAN_PRODUCTS[0]);
  const [showPreApprovalModal, setShowPreApprovalModal] = useState<boolean>(false);

  // Pre-approval simulation state
  const [applicantSalary, setApplicantSalary] = useState<number>(6500);
  const [existingDebt, setExistingDebt] = useState<number>(1400);
  const [isSingpassLinked, setIsSingpassLinked] = useState<boolean>(false);
  const [preApprovalResult, setPreApprovalResult] = useState<{
    status: 'approved' | 'conditional' | 'review';
    maxQuantum: number;
    monthlyInstallment: number;
    tdsrRatio: number;
    approvalRef: string;
  } | null>(null);

  // Dynamic monthly calculation
  const calculateRepayment = (product: LoanProduct, principal: number, years: number) => {
    if (product.interestRate === 0) {
      // 0% interest plan (e.g. Homestyler in-house)
      const months = Math.min(years * 12, 12);
      return {
        monthly: principal / months,
        totalInterest: 0,
        totalPayable: principal,
      };
    }
    const totalInterest = principal * (product.interestRate / 100) * years;
    const totalPayable = principal + totalInterest;
    const monthly = totalPayable / (years * 12);
    return {
      monthly: Math.round(monthly),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  };

  const currentRepayment = useMemo(() => {
    return calculateRepayment(selectedProduct, loanAmount, tenureYears);
  }, [selectedProduct, loanAmount, tenureYears]);

  // Run pre-approval evaluation
  const handleRunPreApproval = () => {
    const totalMonthlyCommitment = existingDebt + currentRepayment.monthly;
    const tdsr = (totalMonthlyCommitment / applicantSalary) * 100;
    const maxAllowedBySalary = Math.min(50000, applicantSalary * 6);

    const ref = `HOMESTYLER-LOAN-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = {
      status: (tdsr <= 55 ? 'approved' : 'conditional') as 'approved' | 'conditional',
      maxQuantum: maxAllowedBySalary,
      monthlyInstallment: currentRepayment.monthly,
      tdsrRatio: Math.round(tdsr),
      approvalRef: ref,
    };

    setPreApprovalResult(result);

    if (result.status === 'approved') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
              <span>Financing Hub &amp; Singapore Bank Marketplace</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Renovation Loan Marketplace &amp; Cashflow Planner
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Compare Singapore’s top licensed bank renovation loans side-by-side with 0% markups. Check your instant pre-approval eligibility without impacting your credit score.
            </p>
          </div>

          <button
            onClick={() => {
              setShowPreApprovalModal(true);
              setPreApprovalResult(null);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Instant Pre-Approval Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Loan Calculator Controls Box */}
        <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Required Loan Quantum
                  </label>
                  <span className="text-xl font-extrabold text-stone-900 font-mono tabular-nums">
                    ${loanAmount.toLocaleString()} SGD
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={1000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                  <span>$5,000 (Touch-up)</span>
                  <span>$35,000 (Average BTO)</span>
                  <span>$50,000 (Max MAS Cap)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Repayment Tenure
                  </label>
                  <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                    {tenureYears} {tenureYears === 1 ? 'Year' : 'Years'} ({tenureYears * 12} Months)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTenureYears(yr)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        tenureYears === yr
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Repayment Snapshot */}
            <div className="lg:col-span-5 bg-stone-900 text-white rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                  Selected Package: {selectedProduct.bank}
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedProduct.name}
                </div>

                <div className="mt-5 p-4 rounded-lg bg-white/10 backdrop-blur-md">
                  <div className="text-xs text-stone-300">Estimated Monthly Installment</div>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1 tabular-nums">
                    ${currentRepayment.monthly.toLocaleString()}{' '}
                    <span className="text-xs text-stone-400 font-normal">/ month</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-stone-800/80">
                    <div className="text-stone-400">Total Interest</div>
                    <div className="font-mono font-bold text-white tabular-nums">
                      ${currentRepayment.totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-stone-800/80">
                    <div className="text-stone-400">Effective Rate (EIR)</div>
                    <div className="font-mono font-bold text-amber-300 tabular-nums">
                      {selectedProduct.eir}% p.a.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-800">
                <button
                  onClick={() => {
                    setShowPreApprovalModal(true);
                    setPreApprovalResult(null);
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Apply for {selectedProduct.bank} Loan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Comparator Table / Cards */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Side-by-Side Comparison of 6 Renovation Financing Plans
            </h2>
            <div className="text-xs text-stone-500">
              Rates updated against official MAS regulatory filings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOAN_PRODUCTS.map((prod) => {
              const repayment = calculateRepayment(prod, loanAmount, tenureYears);
              const isSelected = selectedProduct.id === prod.id;

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`cursor-pointer rounded-2xl border p-6 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-amber-600 shadow-md ring-1 ring-amber-600'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    {/* Header: Bank & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                          {prod.bank}
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mt-0.5">
                          {prod.name}
                        </h3>
                      </div>
                      {prod.badge && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* Rate & Monthly figures */}
                    <div className="mt-5 p-3.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-stone-500">Interest Rate</div>
                        <div className="text-lg font-extrabold text-stone-900 font-mono tabular-nums">
                          {prod.interestRate}% <span className="text-xs font-normal text-stone-500">p.a.</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-stone-500">Monthly Est.</div>
                        <div className="text-lg font-extrabold text-amber-800 font-mono tabular-nums">
                          ${repayment.monthly.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Metadata unboxed text */}
                    <div className="mt-4 space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">EIR (Effective Rate):</span>
                        <span className="font-mono font-medium">{prod.eir}% p.a.</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Min Annual Salary:</span>
                        <span className="font-mono font-medium">${prod.minAnnualIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Processing Fee:</span>
                        <span className="font-mono font-medium">{prod.processingFee}</span>
                      </div>
                    </div>

                    {/* Key Perks */}
                    <div className="mt-4 space-y-1">
                      {prod.perks.map((perk, i) => (
                        <div key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                        setShowPreApprovalModal(true);
                      }}
                      className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-stone-900 text-white hover:bg-stone-800'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? 'Pre-Approve This Plan' : 'Select & Simulate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre-Approval Simulator Modal */}
        {showPreApprovalModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setShowPreApprovalModal(false)}
                className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                <Landmark className="w-4 h-4" />
                <span>Instant Pre-Approval Simulator</span>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 font-display">
                {selectedProduct.bank} Renovation Financing
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Zero impact on your Credit Bureau Singapore (CBS) score. Simulated using standard MAS TDSR limits.
              </p>

              {!preApprovalResult ? (
                <div className="mt-6 space-y-4">
                  {/* SingPass MyInfo Toggle Simulation */}
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-red-950">SingPass MyInfo Instant Retrieval</div>
                      <div className="text-[11px] text-red-800/80">Auto-fills income from CPF contribution history</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsSingpassLinked(true);
                        setApplicantSalary(7200);
                        setExistingDebt(1100);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        isSingpassLinked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {isSingpassLinked ? 'Linked (Verified)' : 'Retrieve MyInfo'}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Monthly Gross Salary (SGD)
                    </label>
                    <input
                      type="number"
                      value={applicantSalary}
                      onChange={(e) => setApplicantSalary(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Existing Monthly Debt Commitments (Car, Credit Card, Mortgages)
                    </label>
                    <input
                      type="number"
                      value={existingDebt}
                      onChange={(e) => setExistingDebt(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Requested Loan Quantum:</span>
                      <span className="font-mono font-bold">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repayment Term:</span>
                      <span className="font-mono font-bold">{tenureYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Monthly Installment:</span>
                      <span className="font-mono font-bold text-amber-800">
                        ${currentRepayment.monthly.toLocaleString()} / mo
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunPreApproval}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Check Instant Pre-Approval
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-950 font-display">
                      Pre-Approval Confirmed!
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Based on your financial profile, you are eligible for up to{' '}
                      <span className="font-bold font-mono text-emerald-900">
                        ${preApprovalResult.maxQuantum.toLocaleString()} SGD
                      </span>{' '}
                      with {selectedProduct.bank}.
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pre-Approval Reference:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {preApprovalResult.approvalRef}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Calculated TDSR Ratio:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {preApprovalResult.tdsrRatio}% (MAS Cap: 55%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Guaranteed Fixed Rate:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {selectedProduct.interestRate}% p.a.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPreApprovalModal(false)}
                      className="flex-1 py-3 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Save to My Project Escrow
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
