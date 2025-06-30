import { financialModelsData } from '@/services/mockData/financialModels.json';

class FinancialService {
  constructor() {
    this.models = [...financialModelsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.models];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const model = this.models.find(m => m.Id === id);
    if (!model) {
      throw new Error('Financial model not found');
    }
    return { ...model };
  }

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const model = this.models.find(m => m.projectId === projectId);
    if (!model) {
      // Create default model if none exists
      const defaultModel = {
        Id: Math.max(...this.models.map(m => m.Id)) + 1,
        projectId: projectId,
        revenue: [
          { id: 1, name: 'Product Sales', amount: 50000 },
          { id: 2, name: 'Service Revenue', amount: 30000 }
        ],
        expenses: [
          { id: 1, name: 'Marketing', amount: 10000 },
          { id: 2, name: 'Operations', amount: 15000 },
          { id: 3, name: 'Salaries', amount: 25000 }
        ],
        projections: {
          monthly: [],
          quarterly: [],
          yearly: []
        },
        scenarios: ['conservative', 'realistic', 'optimistic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.models.push(defaultModel);
      return { ...defaultModel };
    }
    return { ...model };
  }

  async create(modelData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.models.map(m => m.Id)) + 1;
    const newModel = {
      ...modelData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.models.push(newModel);
    return { ...newModel };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.models.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Financial model not found');
    }
    
    this.models[index] = {
      ...this.models[index],
      ...updateData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.models[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.models.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error('Financial model not found');
    }
    
    this.models.splice(index, 1);
    return { success: true };
  }
}

export const financialService = new FinancialService();