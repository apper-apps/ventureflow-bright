import { projectsData } from "@/services/mockData/projects.json";

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
    // Validate project ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid project ID provided');
    }
    
    try {
      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        
        const project = this.projects.find(p => p.id === id);
        
        if (!project) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        return {
          ...project,
          lastModified: new Date().toISOString()
        };
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
          ? Math.max(...this.projects.map(p => p.id || 0)) + 1 
          : 1;
          
        const newProject = {
          ...projectData,
          id: newId,
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
    // Validate project ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid project ID provided');
    }
    
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid update data provided');
    }
    
    try {
      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
        
        const projectIndex = this.projects.findIndex(p => p.id === id);
        
        if (projectIndex === -1) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        // Validate required fields
        if (updateData.name && updateData.name.trim().length === 0) {
          throw new Error('Project name cannot be empty');
        }
        
        const updatedProject = {
          ...this.projects[projectIndex],
          ...updateData,
          id, // Ensure ID doesn't change
          lastModified: new Date().toISOString()
        };
        
        // Update the mock data
        this.projects[projectIndex] = updatedProject;
        
        return updatedProject;
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
    // Validate project ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid project ID provided');
    }
    
    try {
      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 250 + 150));
        
        const projectIndex = this.projects.findIndex(p => p.id === id);
        
        if (projectIndex === -1) {
          throw new Error(`Project with ID ${id} not found`);
        }
        
        // Remove the project from mock data
        const deletedProject = this.projects.splice(projectIndex, 1)[0];
        
        return {
          message: 'Project deleted successfully',
          deletedProject
        };
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