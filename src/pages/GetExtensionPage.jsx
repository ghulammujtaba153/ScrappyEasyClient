import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaChrome,
    FaCircle,
    FaDownload,
    FaExternalLinkAlt,
    FaPlug,
    FaSyncAlt,
} from "react-icons/fa";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

const CHROME_WEB_STORE_SEARCH_URL = "https://chromewebstore.google.com/detail/lead-buddy-business-conta/lkacglodcmpgjejflajjdcglneamnnim";

const manualInstallSteps = [
    "Download the extension package from the Get Extension section.",
    "Open chrome://extensions in your browser.",
    "Enable Developer mode (top-right toggle).",
    "Click Load unpacked and select the extension folder.",
    "Pin Lead Buddy from Chrome toolbar to keep it visible.",
];

const formatTime = (date) =>
    date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

const GetExtensionPage = () => {
    const [storeRejected, setStoreRejected] = useState(false);
    const [manualChecklist, setManualChecklist] = useState({});
    const [lastCheckedAt, setLastCheckedAt] = useState(new Date());

    const refreshStatus = useCallback(() => {
        setLastCheckedAt(new Date());
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setLastCheckedAt(new Date());
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    const completedManualSteps = useMemo(
        () => manualInstallSteps.filter((_, index) => Boolean(manualChecklist[index])).length,
        [manualChecklist]
    );

    const statusCards = useMemo(
        () => [
            {
                label: "Chrome Web Store",
                status: storeRejected ? "Rejected" : "Available",
                detail: storeRejected
                    ? "Fallback installer recommended"
                    : "Install directly from search",
                active: !storeRejected,
            },
            {
                label: "Direct Installer",
                status: "Online",
                detail: "Ready for immediate install",
                active: true,
            },
            {
                label: "Live Status Sync",
                status: "Updated",
                detail: `Last check at ${formatTime(lastCheckedAt)}`,
                active: true,
            },
        ],
        [lastCheckedAt, storeRejected]
    );

    const toggleManualStep = (index) => {
        setManualChecklist((previous) => ({
            ...previous,
            [index]: !previous[index],
        }));
    };

    const resetManualChecklist = () => {
        setManualChecklist({});
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <main className="pt-32 md:pt-40 pb-24 px-4">
                <section className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                        Get Extension
                    </div>
                    <h1 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.05] text-slate-900 tracking-tight">
                        Install Lead Buddy fast, even if store policy review blocks the listing.
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-base md:text-xl text-slate-600 leading-relaxed">
                        Use the Chrome Web Store when available. If the extension gets rejected for policy reasons,
                        install instantly from this page using the manual guide below.
                    </p>
                </section>

                <section className="max-w-6xl mx-auto mt-10 grid gap-4 md:grid-cols-3">
                    {statusCards.map((card) => (
                        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] text-left">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                            <div className="mt-2 flex items-center gap-2">
                                {card.active ? (
                                    <FaCheckCircle size={12} className="text-emerald-600" />
                                ) : (
                                    <FaCircle size={11} className="text-rose-500" />
                                )}
                                <p className="text-sm font-semibold text-slate-900">{card.status}</p>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{card.detail}</p>
                        </div>
                    ))}
                </section>

                <section className="max-w-6xl mx-auto mt-8 grid gap-6 lg:grid-cols-2">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.35)]">
                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.16em] font-semibold">
                            <FaChrome size={12} /> Primary Route
                        </div>
                        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                            Install from Chrome Web Store
                        </h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">
                            Ask users to search for Lead Buddy in Chrome Web Store, then click Add to Chrome.
                            This is the fastest route whenever listing is active.
                        </p>

                        <ol className="mt-5 space-y-3">
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
                                1. Search for "Lead Buddy" in Chrome Web Store.
                            </li>
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
                                2. Open the extension listing and click Add to Chrome.
                            </li>
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
                                3. Pin Lead Buddy in the browser toolbar for one-click access.
                            </li>
                        </ol>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <a
                                href={CHROME_WEB_STORE_SEARCH_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#0F792C] text-white px-4 py-2.5 text-sm font-semibold shadow-[0_18px_30px_-20px_rgba(15,121,44,0.7)]"
                            >
                                Open Chrome Web Store <FaExternalLinkAlt size={11} />
                            </a>
                            <button
                                type="button"
                                onClick={() => setStoreRejected((previous) => !previous)}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                            >
                                {storeRejected ? "Mark as Available" : "Simulate Policy Rejection"}
                            </button>
                        </div>
                    </article>

                    <article id="direct-install" className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.35)]">
                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.16em] font-semibold">
                            <FaDownload size={12} /> Fallback Route
                        </div>
                        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                            Install from Get Extension (Policy-safe backup)
                        </h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">
                            If Chrome Web Store listing is rejected or delayed due to policy review, users can still install
                            immediately from this page and keep onboarding moving.
                        </p>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Current fallback state</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {storeRejected
                                    ? "Store path blocked. Use direct installer now."
                                    : "Store path available. Direct installer remains ready as backup."}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                This status refreshes live every 30 seconds so users know the safest install option.
                            </p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <Link
                                to="/lead-buddy-support"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                            >
                                <FaPlug size={12} /> Download Extension Package
                            </Link>
                            <button
                                type="button"
                                onClick={refreshStatus}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                            >
                                <FaSyncAlt size={12} /> Refresh Status
                            </button>
                        </div>
                    </article>
                </section>

                <section id="manual-install" className="max-w-6xl mx-auto mt-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.35)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Manual Install Guide</p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                                How to add extension manually in Chrome
                            </h2>
                        </div>
                        <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            {completedManualSteps}/{manualInstallSteps.length} steps completed
                        </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {manualInstallSteps.map((step, index) => {
                            const isDone = Boolean(manualChecklist[index]);

                            return (
                                <button
                                    key={step}
                                    type="button"
                                    onClick={() => toggleManualStep(index)}
                                    className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                                        isDone
                                            ? "border-emerald-300 bg-emerald-50"
                                            : "border-slate-200 bg-slate-50 hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-medium text-slate-800">{step}</p>
                                        {isDone ? (
                                            <FaCheckCircle size={15} className="text-emerald-600 mt-0.5" />
                                        ) : (
                                            <FaCircle size={13} className="text-slate-300 mt-0.5" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                        <button
                            type="button"
                            onClick={resetManualChecklist}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                        >
                            Reset Checklist
                        </button>
                        <Link
                            to="/demo-presentation"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold"
                        >
                            Back to Interactive Journey
                        </Link>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};

export default GetExtensionPage;
