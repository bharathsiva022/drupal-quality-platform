// generators/drupal-analyzer.js - Drupal Configuration Analysis
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { PATHS } from "../server.js";

// ============================================================================
// CUSTOM DRUPAL STRUCTURE ANALYZER
// ============================================================================

/**
 * Analyzes custom Drupal project structure
 * Handles both standard Drupal config and custom YAML structures
 */
export function analyzeCustomDrupalProject() {
  const configDir = PATHS.drupalConfig;
  
  // Check if custom structure exists
  const contentTypesFile = path.join(configDir, 'content_types.yml');
  const userRolesFile = path.join(configDir, 'user_roles.yml');
  const viewsFile = path.join(configDir, 'views.yml');
  
  const hasCustomStructure = fs.existsSync(contentTypesFile) && 
                             fs.existsSync(userRolesFile);
  
  if (hasCustomStructure) {
    return analyzeCustomStructure(configDir);
  } else {
    return analyzeStandardDrupalStructure(configDir);
  }
}

// ============================================================================
// CUSTOM STRUCTURE ANALYZER
// ============================================================================

function analyzeCustomStructure(configDir) {
  const contentTypes = parseCustomContentTypes(configDir);
  const roles = parseCustomUserRoles(configDir);
  const views = parseCustomViews(configDir);
  
  return {
    contentTypes,
    roles,
    views,
    structure: 'custom',
    configPath: configDir
  };
}

function parseCustomContentTypes(configDir) {
  const filePath = path.join(configDir, 'content_types.yml');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = yaml.load(content);
    
    if (!config || !config.content_types) {
      return [];
    }
    
    return Object.entries(config.content_types).map(([machineName, data]) => ({
      machineName,
      name: data.label || machineName,
      description: data.description || '',
      fields: data.fields || {},
      workflow: data.workflow || 'default'
    }));
  } catch (error) {
    console.error(`Error parsing content_types.yml:`, error.message);
    return [];
  }
}

function parseCustomUserRoles(configDir) {
  const filePath = path.join(configDir, 'user_roles.yml');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = yaml.load(content);
    
    if (!config || !config.roles) {
      return [];
    }
    
    return Object.entries(config.roles).map(([id, data]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      permissions: data.permissions || []
    }));
  } catch (error) {
    console.error(`Error parsing user_roles.yml:`, error.message);
    return [];
  }
}

function parseCustomViews(configDir) {
  const filePath = path.join(configDir, 'views.yml');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = yaml.load(content);
    
    if (!config || !config.views) {
      return [];
    }
    
    return Object.entries(config.views).map(([id, data]) => ({
      id,
      label: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `View: ${data.display?.path || id}`,
      path: data.display?.path || '',
      baseTable: data.base_table || 'node'
    }));
  } catch (error) {
    console.error(`Error parsing views.yml:`, error.message);
    return [];
  }
}

// ============================================================================
// STANDARD DRUPAL STRUCTURE ANALYZER
// ============================================================================

function analyzeStandardDrupalStructure(configDir) {
  const contentTypes = parseStandardContentTypes(configDir);
  const roles = parseStandardUserRoles(configDir);
  const views = parseStandardViews(configDir);
  
  return {
    contentTypes,
    roles,
    views,
    structure: 'standard',
    configPath: configDir
  };
}

function parseStandardContentTypes(configDir) {
  const contentTypes = [];
  
  if (!fs.existsSync(configDir)) {
    return contentTypes;
  }
  
  const files = fs.readdirSync(configDir);
  
  files.forEach(file => {
    if (file.startsWith('node.type.') && file.endsWith('.yml')) {
      try {
        const content = fs.readFileSync(path.join(configDir, file), 'utf-8');
        const config = yaml.load(content);
        
        const typeName = file.replace('node.type.', '').replace('.yml', '');
        contentTypes.push({
          machineName: typeName,
          name: config.name || typeName,
          description: config.description || '',
          fields: {},
          workflow: 'default'
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
  });
  
  return contentTypes;
}

function parseStandardUserRoles(configDir) {
  const roles = [];
  
  if (!fs.existsSync(configDir)) {
    return roles;
  }
  
  const files = fs.readdirSync(configDir);
  
  files.forEach(file => {
    if (file.startsWith('user.role.') && file.endsWith('.yml')) {
      try {
        const content = fs.readFileSync(path.join(configDir, file), 'utf-8');
        const config = yaml.load(content);
        
        const roleId = file.replace('user.role.', '').replace('.yml', '');
        roles.push({
          id: roleId,
          label: config.label || roleId,
          permissions: config.permissions || []
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
  });
  
  return roles;
}

function parseStandardViews(configDir) {
  const views = [];
  
  if (!fs.existsSync(configDir)) {
    return views;
  }
  
  const files = fs.readdirSync(configDir);
  
  files.forEach(file => {
    if (file.startsWith('views.view.') && file.endsWith('.yml')) {
      try {
        const content = fs.readFileSync(path.join(configDir, file), 'utf-8');
        const config = yaml.load(content);
        
        const viewId = file.replace('views.view.', '').replace('.yml', '');
        views.push({
          id: viewId,
          label: config.label || viewId,
          description: config.description || '',
          path: '',
          baseTable: 'node'
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
  });
  
  return views;
}