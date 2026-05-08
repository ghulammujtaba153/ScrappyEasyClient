import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    HiOutlineMap,
    HiOutlineMail,
    HiOutlineChatAlt2,
    HiOutlinePhone,
    HiOutlineEye,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineGlobe,
} from "react-icons/hi";
import {
    FaArrowRight,
    FaCheck,
    FaCheckCircle,
    FaExternalLinkAlt,
    FaPhoneAlt,
    FaWhatsapp,
} from "react-icons/fa";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";
import "./DemoPresentationPage.css";

const CHECKLIST_STORAGE_KEY = "mapHarvestInteractiveChecklist";
const ACTIVE_STEP_STORAGE_KEY = "mapHarvestInteractiveActiveStep";
const CHROME_WEB_STORE_SEARCH_URL = "https://chromewebstore.google.com/search/lead%20buddy";
const GOOGLE_MAPS_URL = "https://www.google.com/maps";

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const journeySteps = [
    {
        id: "signup-payment",
        step: "01",
        title: "Create Account and Submit Payment Proof",
        message: "Sign up on the website and upload your payment screenshot.",
        subheading: "Get approved quickly and unlock your full lead generation workspace.",
        microcopy:
            "Choose your plan, complete payment, upload the screenshot, and move forward without onboarding delays.",
        visualDirection:
            "Registration form, plan selection, and payment screenshot upload confirmation.",
        interactionIdea:
            "Toggle sign-up and payment proof to complete the first milestone.",
        icon: HiOutlineUsers,
        actions: [
            { label: "Create Account", to: "/register", external: false },
            { label: "View Pricing", to: "/pricing", external: false },
        ],
    },
    {
        id: "extension-install",
        step: "02",
        title: "Install Lead Buddy Extension",
        message: "Search Lead Buddy in Chrome Web Store and install it.",
        subheading: "If store policy blocks the listing, users can install instantly from Get Extension.",
        microcopy:
            "Get Extension page shows live extension status and exact Chrome install instructions.",
        visualDirection:
            "Web Store install path + fallback install from Get Extension with live status panel.",
        interactionIdea:
            "Switch between approved and rejected states to reveal fallback flow.",
        icon: HiOutlineGlobe,
        actions: [
            { label: "Search on Web Store", to: CHROME_WEB_STORE_SEARCH_URL, external: true },
            { label: "Open Get Extension", to: "/get-extension", external: false },
        ],
    },
    {
        id: "maps-extraction",
        step: "03",
        title: "Extract from Google Maps and Export",
        message: "Use the extension to scrape lead data and export it.",
        subheading: "Enable Lead Buddy from Chrome extensions tab, analyze the page, then export to CRM.",
        microcopy:
            "Open Google Maps, enable the extension from Extensions tab, click \"Analyze Page for Leads\", export to CRM, and done.",
        visualDirection:
            "Google Maps search panel, live scraping rows, and export actions.",
        interactionIdea:
            "Toggle extension enabled state, run Analyze Page for Leads, then export to CRM and finish.",
        icon: HiOutlineMap,
        actions: [
            { label: "Open Google Maps", to: GOOGLE_MAPS_URL, external: true },
            { label: "Login for Extension", to: "/login?extension=true", external: false },
            { label: "See Website Tour", to: "/landing", external: false },
        ],
    },
    {
        id: "operations-dashboard",
        step: "04",
        title: "Open Dashboard and Navigate to Operations",
        message: "View imported data in a clean, streamlined operation screen.",
        subheading: "Everything arrives in one place so users can take action immediately.",
        microcopy:
            "From dashboard to operations, your pipeline becomes organized and easy to work.",
        visualDirection:
            "Dashboard overview with direct entry into operation list and lead table.",
        interactionIdea:
            "Open operations and reveal the imported records panel.",
        icon: HiOutlineUserGroup,
        actions: [
            { label: "Open Operations", to: "/dashboard/operations", external: false },
            { label: "Open Dashboard", to: "/dashboard", external: false },
        ],
    },
    {
        id: "emails-socials",
        step: "05",
        title: "Extract Emails and Social Profiles",
        message: "Enrich each lead with verified emails and social links.",
        subheading: "Reach prospects through more channels from one record.",
        microcopy:
            "Pull contact emails, Instagram, Facebook, and LinkedIn so outreach is faster.",
        visualDirection:
            "Lead enrichment card showing email and social fields filling automatically.",
        interactionIdea:
            "Trigger enrichment and show contact fields populating instantly.",
        icon: HiOutlineMail,
        actions: [
            { label: "Go to Operations", to: "/dashboard/operations", external: false },
            { label: "Open Qualified Leads", to: "/dashboard/qualified-leads", external: false },
        ],
    },
    {
        id: "whatsapp-verify",
        step: "06",
        title: "Verify WhatsApp Numbers",
        message: "Check which leads are available on WhatsApp.",
        subheading: "Filter your list to focus only on reachable contacts.",
        microcopy:
            "Run verification in bulk and mark valid numbers before sending campaigns.",
        visualDirection:
            "Verification queue with verified / not verified status chips.",
        interactionIdea:
            "Simulate a verification batch and update verified totals.",
        icon: HiOutlineChatAlt2,
        actions: [
            { label: "Open WhatsApp Automation", to: "/dashboard/whatsapp-automation", external: false },
            { label: "Open Message Automation", to: "/dashboard/message-automation", external: false },
        ],
    },
    {
        id: "website-opportunities",
        step: "08",
        title: "Bumble/Tinder for Websites",
        message: "Swipe websites left or right to qualify outreach targets.",
        subheading: "Qualify high-intent website prospects in minutes.",
        microcopy:
            "Review business sites quickly and shortlist leads likely to buy website services.",
        visualDirection:
            "Swipe-style website review with accept and reject actions.",
        interactionIdea:
            "Accept and reject website cards to build a focused target list.",
        icon: HiOutlineEye,
        actions: [
            { label: "Open Qualified Leads", to: "/dashboard/qualified-leads", external: false },
            { label: "Open Operations", to: "/dashboard/operations", external: false },
        ],
    },
    {
        id: "cold-calling",
        step: "09",
        title: "Use Cold Calling Feature",
        message: "Call prospects directly from inside the platform.",
        subheading: "Move from qualified lead to direct conversation without context switching.",
        microcopy:
            "Dial instantly, track outcomes, and keep your call flow organized.",
        visualDirection:
            "Built-in dialer with lead details and call status timeline.",
        interactionIdea:
            "Start and stop a call to show live state changes.",
        icon: HiOutlinePhone,
        actions: [
            { label: "Open Cold Caller", to: "/dashboard/cold-caller", external: false },
            { label: "Open Call Center", to: "/dashboard/call", external: false },
        ],
    },
    {
        id: "live-collaboration",
        step: "10",
        title: "Use Collaboration and Connect Google Meet",
        message: "See live users, connect, and collaborate in real time.",
        subheading: "Turn solo outreach into team momentum with built-in collaboration.",
        microcopy:
            "Find active users, connect quickly, and launch Meet sessions for instant coordination.",
        visualDirection:
            "Collaboration feed with online users and Google Meet connection CTA.",
        interactionIdea:
            "Refresh live user count and toggle Meet connected state.",
        icon: HiOutlineGlobe,
        actions: [
            { label: "Open Collaboration", to: "/dashboard/collaboration", external: false },
            { label: "Open Support", to: "/lead-buddy-support", external: false },
        ],
    },
    {
        id: "team-campaigns",
        step: "11",
        title: "Assign Team Members and Build Category Campaigns",
        message: "Organize team ownership and launch campaigns by category.",
        subheading: "Scale operations with clear ownership and campaign structure.",
        microcopy:
            "Invite members, assign roles, and run campaigns without overlap or confusion.",
        visualDirection:
            "Team management board with assignment and campaign status columns.",
        interactionIdea:
            "Add assignments and create campaigns with one-click simulation.",
        icon: HiOutlineUsers,
        actions: [
            { label: "Open Team Page", to: "/dashboard/team", external: false },
            { label: "Open Operations", to: "/dashboard/operations", external: false },
        ],
    },
    {
        id: "twilio-setup",
        step: "12",
        title: "Configure Twilio and Start Calling",
        message: "Finalize Twilio setup so cold calls are ready to launch.",
        subheading: "One setup step unlocks stable outbound calling for your team.",
        microcopy:
            "Connect Twilio credentials, test the line, and start calling with confidence.",
        visualDirection:
            "Twilio settings form with connected status and test call confirmation.",
        interactionIdea:
            "Toggle Twilio connection and run a successful test call.",
        icon: HiOutlinePhone,
        actions: [
            { label: "Open Twilio Settings", to: "/dashboard/twilio-settings", external: false },
            { label: "Open Cold Caller", to: "/dashboard/cold-caller", external: false },
        ],
    },
];

const getInitialChecklist = () => {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

const getInitialActiveStep = () => {
    if (typeof window === "undefined") {
        return journeySteps[0].id;
    }

    const stored = window.localStorage.getItem(ACTIVE_STEP_STORAGE_KEY);
    return journeySteps.some((step) => step.id === stored) ? stored : journeySteps[0].id;
};

const getInitialSimulationState = () => ({
    accountCreated: false,
    paymentUploaded: false,
    extensionRejected: false,
    extensionInstalledStore: false,
    extensionInstalledDirect: false,
    extensionEnabledInChrome: false,
    scrapedCount: 0,
    exportedToCrm: false,
    operationsOpened: false,
    emailsFound: 0,
    socialsFound: 0,
    numbersChecked: 0,
    verifiedCount: 0,
    websitesAccepted: 0,
    websitesRejected: 0,
    coldCallActive: false,
    coldCallMinutes: 0,
    liveUsers: 18,
    meetConnected: false,
    teamAssignments: 0,
    campaignsCreated: 0,
    twilioConnected: false,
    twilioTestDone: false,
});

const DemoPresentationPage = () => {
    const [completedMap, setCompletedMap] = useState(getInitialChecklist);
    const [activeStepId, setActiveStepId] = useState(getInitialActiveStep);
    const [simState, setSimState] = useState(getInitialSimulationState);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(completedMap));
    }, [completedMap]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem(ACTIVE_STEP_STORAGE_KEY, activeStepId);
    }, [activeStepId]);

    const activeStepIndex = useMemo(
        () => journeySteps.findIndex((step) => step.id === activeStepId),
        [activeStepId]
    );

    const activeStep = useMemo(
        () => journeySteps[activeStepIndex] || journeySteps[0],
        [activeStepIndex]
    );

    const completedCount = useMemo(
        () => journeySteps.filter((step) => Boolean(completedMap[step.id])).length,
        [completedMap]
    );

    const progressPercent = Math.round((completedCount / journeySteps.length) * 100);

    const toggleComplete = useCallback((stepId) => {
        setCompletedMap((previous) => ({
            ...previous,
            [stepId]: !previous[stepId],
        }));
    }, []);

    const goToStep = useCallback((nextIndex) => {
        const clamped = Math.max(0, Math.min(nextIndex, journeySteps.length - 1));
        setActiveStepId(journeySteps[clamped].id);
    }, []);

    const goToPrevious = useCallback(() => {
        goToStep((activeStepIndex >= 0 ? activeStepIndex : 0) - 1);
    }, [activeStepIndex, goToStep]);

    const goToNext = useCallback(() => {
        goToStep((activeStepIndex >= 0 ? activeStepIndex : 0) + 1);
    }, [activeStepIndex, goToStep]);

    const markAllDone = () => {
        const nextMap = journeySteps.reduce((acc, step) => {
            acc[step.id] = true;
            return acc;
        }, {});

        setCompletedMap(nextMap);
    };

    const resetAll = () => {
        setCompletedMap({});
        setSimState(getInitialSimulationState());
        setActiveStepId(journeySteps[0].id);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            const target = event.target;
            if (
                target instanceof HTMLElement &&
                (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName) ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (["ArrowRight", "ArrowDown", "PageDown", " ", "Spacebar"].includes(event.key)) {
                event.preventDefault();
                goToNext();
                return;
            }

            if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
                event.preventDefault();
                goToPrevious();
                return;
            }

            if (event.key === "Enter") {
                event.preventDefault();
                toggleComplete(activeStep.id);
                return;
            }

            if (event.key.toLowerCase() === "r") {
                event.preventDefault();
                resetAll();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeStep.id, goToNext, goToPrevious, toggleComplete]);

    return (
        <div className="live-demo-page min-h-screen text-slate-900">
            <Navbar />

            <main className="pt-32 md:pt-40 pb-24">
                <section className="px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="demo-hero-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]"
                        >
                            Live Interactive User Journey
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="mt-6 text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.05]"
                        >
                            Show every user exactly how to go from signup to first outreach.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.12 }}
                            className="mt-6 max-w-3xl mx-auto text-base md:text-xl leading-relaxed text-slate-600"
                        >
                            This walkthrough is now built for real users, not just recordings. Click through each
                            onboarding step, interact with live simulation controls, and jump directly to the relevant
                            app screen.
                        </motion.p>

                        <div className="video-grid">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="video-glow-wrapper"
                            >
                                <div className="video-glow-inner">
                                    <div style={{ position: "relative", paddingBottom: "65.01809408926417%", height: 0 }}>
                                        <iframe 
                                            src="https://www.loom.com/embed/d04652b8c80845e897a20fc390ac8fcd" 
                                            frameBorder="0" 
                                            webkitallowfullscreen="true" 
                                            mozallowfullscreen="true" 
                                            allowFullScreen 
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                        ></iframe>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="video-glow-wrapper"
                            >
                                <div className="video-glow-inner">
                                    <div style={{ position: "relative", paddingBottom: "65.01809408926417%", height: 0 }}>
                                        <iframe 
                                            src="https://www.loom.com/embed/aa527e4975c548d48c5ba2a8334f01da" 
                                            frameBorder="0" 
                                            webkitallowfullscreen="true" 
                                            mozallowfullscreen="true" 
                                            allowFullScreen 
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                        ></iframe>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="px-4 mt-12">
                    <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-8">
                        <aside className="mb-8 lg:mb-0">
                            <div className="demo-pane rounded-3xl p-5 md:p-6 lg:sticky lg:top-28">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-slate-900">Onboarding Progress</h2>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {completedCount}/{journeySteps.length} done
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <div className="demo-progress-track">
                                        <div className="demo-progress-fill" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                                        {progressPercent}% completed
                                    </p>
                                </div>

                                <div className="mt-5 space-y-2.5 max-h-[480px] overflow-auto pr-1">
                                    {journeySteps.map((step, index) => {
                                        const isActive = step.id === activeStep.id;
                                        const isDone = Boolean(completedMap[step.id]);
                                        const StepIcon = step.icon;

                                        return (
                                            <div
                                                key={step.id}
                                                className={`demo-step-button ${isActive ? "is-active" : ""} ${
                                                    isDone ? "is-done" : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveStepId(step.id)}
                                                    className="demo-step-main"
                                                >
                                                    <div className="demo-step-icon">
                                                        <StepIcon size={16} />
                                                    </div>
                                                    <div className="min-w-0 text-left">
                                                        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                                                            Step {index + 1}
                                                        </p>
                                                        <p className="truncate text-sm font-semibold text-slate-900">{step.title}</p>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleComplete(step.id)}
                                                    className={`demo-step-check ${isDone ? "is-done" : ""}`}
                                                    aria-label={`Mark ${step.title} as ${isDone ? "incomplete" : "complete"}`}
                                                >
                                                    {isDone ? <FaCheck size={10} /> : null}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-2.5">
                                    <button type="button" onClick={goToPrevious} className="demo-nav-button">
                                        Previous
                                    </button>
                                    <button type="button" onClick={goToNext} className="demo-nav-button">
                                        Next
                                    </button>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2.5">
                                    <button type="button" onClick={resetAll} className="demo-nav-button alt">
                                        Reset
                                    </button>
                                    <button type="button" onClick={markAllDone} className="demo-nav-button alt">
                                        Mark All
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.article
                                    key={activeStep.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="demo-pane rounded-3xl p-6 md:p-8"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                Step {activeStepIndex + 1}
                                            </p>
                                            <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-slate-900 leading-tight">
                                                {activeStep.message}
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleComplete(activeStep.id)}
                                            className={`demo-complete-button ${
                                                completedMap[activeStep.id] ? "is-complete" : ""
                                            }`}
                                        >
                                            {completedMap[activeStep.id] ? "Completed" : "Mark Complete"}
                                        </button>
                                    </div>

                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 md:p-5">
                                        <h3 className="text-xl font-semibold text-slate-900">{activeStep.title}</h3>
                                        <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed">
                                            {activeStep.subheading}
                                        </p>
                                    </div>

                                    <div className="mt-4 grid gap-3">
                                        <InfoBlock title="Microcopy" content={activeStep.microcopy} />
                                        <InfoBlock title="Interaction Focus" content={activeStep.interactionIdea} />
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        {activeStep.actions.map((action, index) => (
                                            <StepActionLink key={action.label} action={action} primary={index === 0} />
                                        ))}
                                    </div>
                                </motion.article>
                            </AnimatePresence>

                            <section className="demo-pane rounded-3xl p-6 md:p-8">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg md:text-xl font-semibold text-slate-900">Live Interactive Simulator</h3>
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                                        Try This Step
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-600">
                                    Use these controls to demonstrate the exact user flow for this step.
                                </p>

                                <div className="mt-5 demo-simulator-shell rounded-2xl p-4 md:p-5">
                                    <LiveStepSimulator
                                        stepId={activeStep.id}
                                        simState={simState}
                                        setSimState={setSimState}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </section>

                <section className="px-4 mt-12">
                    <div className="max-w-5xl mx-auto demo-closing-card rounded-3xl p-7 md:p-10 text-center">
                        <h2 className="text-2xl md:text-4xl font-semibold text-slate-900">
                            From setup to outreach, users always know the next move.
                        </h2>
                        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                            This interactive path makes onboarding obvious, shortens activation time, and moves users to
                            meaningful actions faster.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link to="/register" className="demo-cta-primary">
                                Start as New User <FaArrowRight size={12} />
                            </Link>
                            <Link to="/get-extension" className="demo-cta-secondary">
                                Open Get Extension
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};

const StepActionLink = ({ action, primary = false }) => {
    const className = `demo-action-link ${primary ? "is-primary" : "is-secondary"}`;

    if (action.external) {
        return (
            <a href={action.to} target="_blank" rel="noopener noreferrer" className={className}>
                {action.label}
                <FaExternalLinkAlt size={10} />
            </a>
        );
    }

    return (
        <Link to={action.to} className={className}>
            {action.label}
            <FaArrowRight size={11} />
        </Link>
    );
};

const InfoBlock = ({ title, content }) => {
    return (
        <div className="demo-info-block rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">{title}</p>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-700">{content}</p>
        </div>
    );
};

const LiveStepSimulator = ({ stepId, simState, setSimState }) => {
    const update = (next) => {
        setSimState((previous) => ({
            ...previous,
            ...(typeof next === "function" ? next(previous) : next),
        }));
    };

    if (stepId === "signup-payment") {
        const approved = simState.accountCreated && simState.paymentUploaded;

        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Activation Checklist</h4>
                    <StatusRow label="Account created" active={simState.accountCreated} />
                    <StatusRow label="Payment screenshot uploaded" active={simState.paymentUploaded} />
                    <StatusRow label="Access approved" active={approved} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label={simState.accountCreated ? "Undo Sign Up" : "Simulate Sign Up"}
                            onClick={() => update({ accountCreated: !simState.accountCreated })}
                        />
                        <SimButton
                            label={simState.paymentUploaded ? "Undo Upload" : "Upload Payment Screenshot"}
                            onClick={() => update({ paymentUploaded: !simState.paymentUploaded })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "extension-install") {
        const installReady = simState.extensionRejected
            ? simState.extensionInstalledDirect
            : simState.extensionInstalledStore;

        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Live Extension Status</h4>
                    <StatusRow
                        label="Chrome Web Store listing"
                        active={!simState.extensionRejected}
                        inactiveLabel="Policy review blocked"
                        activeLabel="Available"
                    />
                    <StatusRow
                        label="Get Extension fallback"
                        active={simState.extensionRejected}
                        inactiveLabel="Idle"
                        activeLabel="Ready"
                    />
                    <StatusRow label="Extension installed" active={installReady} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label={simState.extensionRejected ? "Switch to Approved" : "Simulate Store Rejection"}
                            onClick={() =>
                                update((previous) => ({
                                    extensionRejected: !previous.extensionRejected,
                                    extensionInstalledStore: previous.extensionRejected
                                        ? previous.extensionInstalledStore
                                        : false,
                                }))
                            }
                        />
                        <SimButton
                            label="Install from Web Store"
                            onClick={() => update({ extensionInstalledStore: true })}
                            disabled={simState.extensionRejected}
                        />
                        <SimButton
                            label="Install from Get Extension"
                            onClick={() => update({ extensionInstalledDirect: true })}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "maps-extraction") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Extraction Output</h4>
                    <StatusRow
                        label="Extension enabled from Extensions tab"
                        active={simState.extensionEnabledInChrome}
                        activeLabel="Enabled"
                        inactiveLabel="Disabled"
                    />
                    <StatusRow
                        label="Analyze Page for Leads"
                        active={simState.scrapedCount > 0}
                        activeLabel="Done"
                        inactiveLabel="Pending"
                    />
                    <CounterRow label="Leads extracted" value={simState.scrapedCount} />
                    <StatusRow label="Export to CRM" active={simState.exportedToCrm} activeLabel="Done" />
                    <p className="text-xs text-slate-500 mt-2">Available for both free and paid users.</p>
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label={simState.extensionEnabledInChrome ? "Disable Extension" : "Enable Extension from Extensions Tab"}
                            onClick={() =>
                                update((previous) => ({
                                    extensionEnabledInChrome: !previous.extensionEnabledInChrome,
                                }))
                            }
                        />
                        <SimButton
                            label="Analyze Page for Leads"
                            onClick={() =>
                                update((previous) => ({
                                    scrapedCount: previous.scrapedCount + randomBetween(25, 90),
                                }))
                            }
                            disabled={!simState.extensionEnabledInChrome}
                        />
                        <SimButton
                            label="Export to CRM and Done"
                            onClick={() => update({ exportedToCrm: true })}
                            disabled={simState.scrapedCount === 0}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "operations-dashboard") {
        const rows = [
            "City Dental Group",
            "Peak Roofing Co",
            "Coastal Electric",
            "Northline Movers",
        ];

        return (
            <div className="space-y-3">
                <div className="demo-sim-block">
                    <h4>Operations View</h4>
                    <StatusRow label="Operations screen opened" active={simState.operationsOpened} />
                    <CounterRow label="Rows currently visible" value={simState.operationsOpened ? Math.max(4, simState.scrapedCount) : 0} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label={simState.operationsOpened ? "Refresh Operations" : "Open Operations"}
                            onClick={() => update({ operationsOpened: true })}
                        />
                    </div>
                    {simState.operationsOpened && (
                        <div className="mt-3 space-y-2">
                            {rows.map((row) => (
                                <div key={row} className="demo-inline-row">
                                    <span>{row}</span>
                                    <span className="demo-inline-chip">Active</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (stepId === "emails-socials") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Contact Enrichment</h4>
                    <CounterRow label="Business emails found" value={simState.emailsFound} />
                    <CounterRow label="Social profiles found" value={simState.socialsFound} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label="Extract Emails + Socials"
                            onClick={() => {
                                const pool = Math.max(simState.scrapedCount, 40);
                                update({
                                    emailsFound: randomBetween(Math.floor(pool * 0.45), Math.floor(pool * 0.8)),
                                    socialsFound: randomBetween(Math.floor(pool * 0.4), Math.floor(pool * 0.9)),
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "whatsapp-verify") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>WhatsApp Verification</h4>
                    <CounterRow label="Numbers checked" value={simState.numbersChecked} />
                    <CounterRow label="Verified numbers" value={simState.verifiedCount} icon={<FaWhatsapp size={12} />} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label="Run Verification"
                            onClick={() => {
                                const pool = Math.max(simState.emailsFound, 40);
                                const checked = randomBetween(Math.floor(pool * 0.65), pool);
                                update({
                                    numbersChecked: checked,
                                    verifiedCount: randomBetween(Math.floor(checked * 0.55), checked),
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "website-opportunities") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Website Qualification</h4>
                    <CounterRow label="Accepted opportunities" value={simState.websitesAccepted} />
                    <CounterRow label="Rejected opportunities" value={simState.websitesRejected} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label="Accept Current Website"
                            onClick={() => update((previous) => ({ websitesAccepted: previous.websitesAccepted + 1 }))}
                        />
                        <SimButton
                            label="Reject Current Website"
                            onClick={() => update((previous) => ({ websitesRejected: previous.websitesRejected + 1 }))}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "cold-calling") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Cold Call Status</h4>
                    <StatusRow
                        label="Dialer"
                        active={simState.coldCallActive}
                        activeLabel="Connected"
                        inactiveLabel="Idle"
                    />
                    <CounterRow label="Current call (minutes)" value={simState.coldCallMinutes} icon={<FaPhoneAlt size={11} />} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label={simState.coldCallActive ? "End Call" : "Start Cold Call"}
                            onClick={() =>
                                update((previous) => ({
                                    coldCallActive: !previous.coldCallActive,
                                    coldCallMinutes: previous.coldCallActive ? 0 : randomBetween(1, 6),
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "live-collaboration") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Collaboration Room</h4>
                    <CounterRow label="Live users online" value={simState.liveUsers} />
                    <StatusRow
                        label="Google Meet link"
                        active={simState.meetConnected}
                        activeLabel="Connected"
                        inactiveLabel="Not connected"
                    />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label="Refresh Live Users"
                            onClick={() => update({ liveUsers: randomBetween(10, 42) })}
                        />
                        <SimButton
                            label={simState.meetConnected ? "Disconnect Meet" : "Connect Google Meet"}
                            onClick={() => update({ meetConnected: !simState.meetConnected })}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (stepId === "team-campaigns") {
        return (
            <div className="demo-sim-grid">
                <div className="demo-sim-block">
                    <h4>Team Campaign Setup</h4>
                    <CounterRow label="Members assigned" value={simState.teamAssignments} />
                    <CounterRow label="Campaigns created" value={simState.campaignsCreated} />
                </div>
                <div className="demo-sim-block">
                    <h4>Actions</h4>
                    <div className="space-y-2">
                        <SimButton
                            label="Assign Team Member"
                            onClick={() => update((previous) => ({ teamAssignments: previous.teamAssignments + 1 }))}
                        />
                        <SimButton
                            label="Create Category Campaign"
                            onClick={() => update((previous) => ({ campaignsCreated: previous.campaignsCreated + 1 }))}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="demo-sim-grid">
            <div className="demo-sim-block">
                <h4>Twilio Readiness</h4>
                <StatusRow label="Twilio connected" active={simState.twilioConnected} />
                <StatusRow
                    label="Test call"
                    active={simState.twilioTestDone}
                    activeLabel="Successful"
                    inactiveLabel="Not tested"
                />
            </div>
            <div className="demo-sim-block">
                <h4>Actions</h4>
                <div className="space-y-2">
                    <SimButton
                        label={simState.twilioConnected ? "Disconnect Twilio" : "Connect Twilio"}
                        onClick={() =>
                            update((previous) => ({
                                twilioConnected: !previous.twilioConnected,
                                twilioTestDone: previous.twilioConnected ? false : previous.twilioTestDone,
                            }))
                        }
                    />
                    <SimButton
                        label="Run Test Call"
                        onClick={() => update({ twilioTestDone: true })}
                        disabled={!simState.twilioConnected}
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
};

const SimButton = ({ label, onClick, disabled = false, variant = "primary" }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`demo-sim-button ${variant === "secondary" ? "is-secondary" : ""}`}
        >
            {label}
        </button>
    );
};

const CounterRow = ({ label, value, icon = null }) => {
    return (
        <div className="demo-status-row">
            <div className="flex items-center gap-2 min-w-0">
                {icon}
                <span className="truncate">{label}</span>
            </div>
            <span className="demo-counter-chip">{value}</span>
        </div>
    );
};

const StatusRow = ({
    label,
    active,
    activeLabel = "Done",
    inactiveLabel = "Pending",
}) => {
    return (
        <div className="demo-status-row">
            <span>{label}</span>
            <span className={`demo-state-chip ${active ? "is-active" : ""}`}>
                {active ? (
                    <>
                        <FaCheckCircle size={10} /> {activeLabel}
                    </>
                ) : (
                    inactiveLabel
                )}
            </span>
        </div>
    );
};

export default DemoPresentationPage;