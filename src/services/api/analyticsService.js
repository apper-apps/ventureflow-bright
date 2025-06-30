import analyticsData from '@/services/mockData/analytics.json';

class AnalyticsService {
  constructor() {
    this.analytics = { ...analyticsData };
  }

  async getAnalytics(timeRange = '30d') {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate different data based on time range
    const multiplier = {
      '7d': 0.3,
      '30d': 1.0,
      '90d': 2.5,
      '1y': 8.0
    };
    
    const factor = multiplier[timeRange] || 1.0;
    
    return {
      ...this.analytics,
      totalProjects: Math.round(this.analytics.totalProjects * factor),
      totalProjectedRevenue: Math.round(this.analytics.totalProjectedRevenue * factor),
      validationTrendData: this.analytics.validationTrendData.map(val => 
        Math.min(100, Math.round(val * (0.8 + factor * 0.2)))
      ),
      revenueProjectionData: {
        conservative: this.analytics.revenueProjectionData.conservative.map(val => 
          Math.round(val * factor)
        ),
        optimistic: this.analytics.revenueProjectionData.optimistic.map(val => 
          Math.round(val * factor)
        )
      }
    };
  }

  async getProjectAnalytics(projectId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return analytics specific to a project
    return {
      projectId: projectId,
      completionRate: 75,
      validationScore: 82,
      timeSpent: '12 hours',
      sectionsCompleted: 6,
      totalSections: 8,
      lastActivity: new Date().toISOString()
    };
  }

  async getUsageStats() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      projectsCreated: this.analytics.totalProjects,
      templatesUsed: 8,
      exportsGenerated: 15,
      aiQueriesUsed: 42,
      collaboratorsInvited: 3
    };
  }
}

export const analyticsService = new AnalyticsService();