import { templatesData } from '@/services/mockData/templates.json';

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.templates];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const template = this.templates.find(t => t.Id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.templates.filter(t => t.category === category);
  }

  async getFeatured() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.templates.filter(t => t.featured);
  }
}

export const templateService = new TemplateService();