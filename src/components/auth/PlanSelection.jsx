import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/URL";
import { FaCheck } from "react-icons/fa";

const PlanSelection = ({ selectedPlan, onPlanSelect }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [planType, setPlanType] = useState("free"); // free or paid

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/packages`);
                setPlans(res.data.packages);
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handlePlanTypeChange = (type) => {
        setPlanType(type);
        if (type === "free") {
            onPlanSelect(null);
        }
    };

    return (
        <div className="mb-10 w-full animate-fadeIn">
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-xl flex shadow-inner">
                    <button
                        type="button"
                        onClick={() => handlePlanTypeChange("free")}
                        className={`px-10 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                            planType === "free" 
                            ? "bg-white text-primary shadow-md transform scale-105" 
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Free Plan
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePlanTypeChange("paid")}
                        className={`px-10 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                            planType === "paid" 
                            ? "bg-white text-primary shadow-md transform scale-105" 
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Paid Plans
                    </button>
                </div>
            </div>

            {planType === "paid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideIn">
                    {plans.map((plan) => (
                        <div
                            key={plan._id}
                            onClick={() => onPlanSelect(plan)}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                selectedPlan?._id === plan._id
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg"
                                    : "border-gray-100 bg-white hover:border-primary/40 hover:shadow-md"
                            }`}
                        >
                            {selectedPlan?._id === plan._id && (
                                <div className="absolute top-0 right-0 bg-primary text-white p-2 rounded-bl-xl">
                                    <FaCheck size={12} />
                                </div>
                            )}
                            <div className="mb-4">
                                <h3 className={`font-bold text-lg ${selectedPlan?._id === plan._id ? "text-primary" : "text-gray-800"}`}>
                                    {plan.name}
                                </h3>
                            </div>
                            <div className="mb-4 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                                <span className="text-gray-500 text-sm">/{plan.interval}</span>
                            </div>
                            <ul className="space-y-2.5">
                                {plan.features?.slice(0, 4).map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <FaCheck className="text-primary mt-1 flex-shrink-0 text-[10px]" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {loading && (
                        <div className="col-span-2 py-10 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>
            )}

            {planType === "free" && (
                <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200 animate-slideIn">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-primary" />
                    </div>
                    <p className="text-gray-800 font-bold text-lg mb-1">Standard Free Access</p>
                    <p className="text-gray-600 text-sm max-w-xs mx-auto">
                        High-speed lead scraping and basic management tools included.
                    </p>
                    <div className="mt-4 inline-block px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Upgrade anytime later
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanSelection;
