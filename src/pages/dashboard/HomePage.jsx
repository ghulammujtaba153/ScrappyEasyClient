import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../config/URL";
import { Spin } from "antd";
import {
    ChartFilter,
    LeadsAreaChart,
    RatingPieChart,
    CityBarChart,
    WhatsAppDonutChart
} from "../../components/charts";

const HomePage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        citiesCovered: 0,
        totalLeads: 0,
        whatsappAvailable: 0,
        lowRated: 0
    });
    const [chartData, setChartData] = useState({
        leadsOverTime: [],
        ratingDistribution: [],
        cityDistribution: [],
        whatsappDistribution: []
    });
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('yearly');

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?._id && !user?.id) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/api/dashboard/stats/${user._id || user.id}`);
                if (response.data?.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user?._id, user?.id]);

    useEffect(() => {
        const fetchChartData = async () => {
            if (!user?._id && !user?.id) {
                setChartLoading(false);
                return;
            }

            setChartLoading(true);
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/dashboard/charts/${user._id || user.id}?filter=${timeFilter}`
                );
                if (response.data?.success) {
                    setChartData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            } finally {
                setChartLoading(false);
            }
        };

        fetchChartData();
    }, [user?._id, user?.id, timeFilter]);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-600">
                    Here's an overview of your account and recent activity.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-primary rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Spin size="small" className="mt-2" />
                            ) : (
                                <p className="text-3xl font-bold mt-2">{stats.citiesCovered}</p>
                            )}
                            <p className="text-purple-100 text-sm font-medium">Cities Covered</p>

                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Spin size="small" className="mt-2" />
                            ) : (
                                <p className="text-3xl font-bold mt-2">{stats.totalLeads}</p>
                            )}
                            <p className="text-blue-100 text-sm font-medium">Total Leads</p>

                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Spin size="small" className="mt-2" />
                            ) : (
                                <p className="text-3xl font-bold mt-2">{stats.whatsappAvailable}</p>
                            )}
                            <p className="text-green-100 text-sm font-medium">WhatsApp Available</p>

                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Spin size="small" className="mt-2" />
                            ) : (
                                <p className="text-3xl font-bold mt-2">{stats.lowRated}</p>
                            )}
                            <p className="text-orange-100 text-sm font-medium">Low Rated (&lt;4.0)</p>

                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section Header with Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3 sm:mb-0">Analytics Overview</h3>
                <ChartFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LeadsAreaChart data={chartData.leadsOverTime} loading={chartLoading} />
                <RatingPieChart data={chartData.ratingDistribution} loading={chartLoading} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CityBarChart data={chartData.cityDistribution} loading={chartLoading} />
                <WhatsAppDonutChart data={chartData.whatsappDistribution} loading={chartLoading} />
            </div>
        </div>
    );
};

export default HomePage;