import React from 'react';

export default function OperationDetailStats({ verificationStats }) {
  if (!verificationStats?.allLeads) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
        Lead counts & WhatsApp verification
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="All leads" hint="In this operation" value={verificationStats.allLeads} />
        <StatCard label="With phone" hint="Can verify WhatsApp" value={verificationStats.withPhone} variant="slate" />
        {verificationStats.withoutPhone > 0 && (
          <StatCard label="No phone" hint="Excluded from WA stats" value={verificationStats.withoutPhone} variant="gray" />
        )}
        <StatCard label="WA verified" hint="Has WhatsApp" value={verificationStats.verified} variant="green" />
        <StatCard label="No WhatsApp" hint="Phone, not on WA" value={verificationStats.notVerified} variant="red" />
        <StatCard label="WA not checked" hint="Phone, pending" value={verificationStats.notChecked} variant="orange" />
      </div>
    </div>
  );
}

function StatCard({ label, hint, value, variant = 'default' }) {
  const styles = {
    default: 'bg-white/50 border-gray-100 text-gray-900',
    slate: 'bg-slate-50/80 border-slate-200 text-slate-800',
    gray: 'bg-gray-50/80 border-gray-200 text-gray-700',
    green: 'bg-green-50/50 border-green-100 text-green-700',
    red: 'bg-red-50/50 border-red-100 text-red-700',
    orange: 'bg-orange-50/50 border-orange-100 text-orange-700',
  };
  const labelStyles = {
    default: 'text-gray-500',
    slate: 'text-slate-600',
    gray: 'text-gray-500',
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
  };

  return (
    <div className={`backdrop-blur-sm p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[88px] ${styles[variant]}`}>
      <p className={`text-[10px] uppercase tracking-wider font-black leading-tight ${labelStyles[variant]}`}>{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
      <p className={`text-2xl font-black mt-auto ${styles[variant].split(' ').pop()}`}>{value}</p>
    </div>
  );
}
