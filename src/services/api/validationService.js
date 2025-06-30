import { validationData } from '@/services/mockData/validation.json';

class ValidationService {
  constructor() {
    this.validation = [...validationData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.validation];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const validation = this.validation.find(v => v.Id === id);
    if (!validation) {
      throw new Error('Validation data not found');
    }
    return { ...validation };
  }

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const validation = this.validation.find(v => v.projectId === projectId);
    if (!validation) {
      // Create default validation if none exists
      const defaultValidation = {
        Id: Math.max(...this.validation.map(v => v.Id)) + 1,
        projectId: projectId,
        framework: 'lean-canvas',
        scores: {
          'lean-canvas': {
            'problem': 75,
            'solution': 80,
            'key-metrics': 60,
            'value-proposition': 85,
            'unfair-advantage': 50,
            'channels': 70,
            'customer-segments': 75,
            'cost-structure': 65,
            'revenue-streams': 80
          },
          'swot': {
            'strengths': 80,
            'weaknesses': 60,
            'opportunities': 75,
            'threats': 55
          },
          'customer-validation': {
            'customer-interviews': 70,
            'surveys': 65,
            'mvp-feedback': 60,
            'market-research': 75
          }
        },
        recommendations: [
          {
            framework: 'lean-canvas',
            title: 'Strengthen Unfair Advantage',
            description: 'Your unfair advantage score is low. Consider what unique assets or capabilities give you a competitive edge.',
            priority: 'high',
            actionText: 'Improve Score',
            actionUrl: '/validation'
          },
          {
            framework: 'swot',
            title: 'Address Key Weaknesses',
            description: 'Identify and create plans to address your most critical weaknesses.',
            priority: 'medium',
            actionText: 'View Details',
            actionUrl: '/validation'
          }
        ],
        timestamp: new Date().toISOString()
      };
      this.validation.push(defaultValidation);
      return { ...defaultValidation };
    }
    return { ...validation };
  }

  async create(validationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.validation.map(v => v.Id)) + 1;
    const newValidation = {
      ...validationData,
      Id: newId,
      timestamp: new Date().toISOString()
    };
    this.validation.push(newValidation);
    return { ...newValidation };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.validation.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error('Validation data not found');
    }
    
    this.validation[index] = {
      ...this.validation[index],
      ...updateData,
      Id: id,
      timestamp: new Date().toISOString()
    };
    
    return { ...this.validation[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.validation.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error('Validation data not found');
    }
    
    this.validation.splice(index, 1);
    return { success: true };
  }
}

export const validationService = new ValidationService();