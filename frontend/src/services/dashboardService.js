import api from './api';

const getDashboardAnalytics = async () => {
    const response = await api.get('/api/dashboard/analytics');
    return response.data;
};

const dashboardService = {
    getDashboardAnalytics,
};

export default dashboardService; 