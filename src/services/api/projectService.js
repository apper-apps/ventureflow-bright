import { projectsData } from '@/services/mockData/projects.json';

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
    this.requestTimeout = 10000; // 10 seconds
    this.maxRetries = 3;
  }

  async withTimeout(promise, timeoutMs = this.requestTimeout) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }

  async withRetry(operation, retries = this.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

async getAll() {
    try {
      const operation = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!this.projects || this.projects.length === 0) {
          throw new Error('No projects data available');
        }
        
        return [...this.projects];
      };

      return await this.withTimeout(this.withRetry(operation));
    } catch (error) {
      console.error('ProjectService.getAll failed:', error);
      
      if (error.message === 'Request timeout') {
        throw new Error('Failed to load projects: Request timed out. Please check your connection and try again.');
      }
      
      throw new Error('Failed to load projects. Please try again later.');
    }
  }

async getById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid project ID provided');
      }

      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 250));
        
        if (!this.projects || this.projects.length === 0) {
          throw new Error('Projects data not available');
        }
        
        const project = this.projects.find(p => p.Id === id);
        if (!project) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        return { ...project };
      };

      return await this.withTimeout(this.withRetry(operation));
    } catch (error) {
      console.error('ProjectService.getById failed:', error);
      
      if (error.message === 'Request timeout') {
        throw new Error('Failed to load project: Request timed out. Please try again.');
      }
      
      if (error.message.includes('not found')) {
        throw error; // Pass through not found errors as-is
      }
      
      throw new Error('Failed to load project. Please try again later.');
    }
  }

async create(projectData) {
    try {
      if (!projectData || typeof projectData !== 'object') {
        throw new Error('Invalid project data provided');
      }

      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newId = this.projects.length > 0 
          ? Math.max(...this.projects.map(p => p.Id || 0)) + 1 
          : 1;
          
        const newProject = {
          ...projectData,
          Id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.projects.push(newProject);
        return { ...newProject };
      };

      return await this.withTimeout(this.withRetry(operation));
    } catch (error) {
      console.error('ProjectService.create failed:', error);
      
      if (error.message === 'Request timeout') {
        throw new Error('Failed to create project: Request timed out. Please try again.');
      }
      
      throw new Error('Failed to create project. Please try again later.');
    }
  }

async update(id, updateData) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid project ID provided');
      }
      
      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Invalid update data provided');
      }

      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 350));
        
        const index = this.projects.findIndex(p => p.Id === id);
        if (index === -1) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        this.projects[index] = {
          ...this.projects[index],
          ...updateData,
          Id: id, // Ensure ID doesn't change
          updatedAt: new Date().toISOString()
        };
        
        return { ...this.projects[index] };
      };

      return await this.withTimeout(this.withRetry(operation));
    } catch (error) {
      console.error('ProjectService.update failed:', error);
      
      if (error.message === 'Request timeout') {
        throw new Error('Failed to update project: Request timed out. Please try again.');
      }
      
      if (error.message.includes('not found')) {
        throw error; // Pass through not found errors as-is
      }
      
      throw new Error('Failed to update project. Please try again later.');
    }
  }

async delete(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid project ID provided');
      }

      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.projects.findIndex(p => p.Id === id);
        if (index === -1) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        this.projects.splice(index, 1);
        return { success: true, deletedId: id };
      };

      return await this.withTimeout(this.withRetry(operation));
    } catch (error) {
      console.error('ProjectService.delete failed:', error);
      
      if (error.message === 'Request timeout') {
        throw new Error('Failed to delete project: Request timed out. Please try again.');
      }
      
      if (error.message.includes('not found')) {
        throw error; // Pass through not found errors as-is
      }
      
      throw new Error('Failed to delete project. Please try again later.');
    }
  }
}

export const projectService = new ProjectService();