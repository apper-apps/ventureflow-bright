import { projectsData } from '@/services/mockData/projects.json';

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.projects];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const project = this.projects.find(p => p.Id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  }

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.projects.map(p => p.Id)) + 1;
    const newProject = {
      ...projectData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...updateData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.projects[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects.splice(index, 1);
    return { success: true };
  }
}

export const projectService = new ProjectService();