const DatabaseService = require('../services/databaseService');

const dbService = new DatabaseService();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Get user projects request:', JSON.stringify(event, null, 2));

  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    const userId = event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    // Get user projects from database
    const projects = await dbService.getUserProjects(userId);

    // Return projects data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        projects: projects,
        count: projects.length
      })
    };

  } catch (error) {
    console.error('Error in getUserProjects:', error);

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