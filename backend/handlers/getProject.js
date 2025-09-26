const DatabaseService = require('../services/databaseService');

const dbService = new DatabaseService();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Get project request:', JSON.stringify(event, null, 2));

  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    const projectId = event.pathParameters?.projectId;

    if (!projectId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Project ID is required' })
      };
    }

    // Get project from database
    const project = await dbService.getProject(projectId);

    if (!project) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Project not found' })
      };
    }

    // Increment view count
    await dbService.incrementProjectViews(projectId);

    // Return project data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        project: project
      })
    };

  } catch (error) {
    console.error('Error in getProject:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};