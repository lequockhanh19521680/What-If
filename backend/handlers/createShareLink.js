const DatabaseService = require('../services/databaseService');

const dbService = new DatabaseService();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Create share link request:', JSON.stringify(event, null, 2));

  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    const body = JSON.parse(event.body);
    const { projectId, platform } = body;

    if (!projectId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Project ID is required' })
      };
    }

    // Get project details
    const project = await dbService.getProject(projectId);

    if (!project) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Project not found' })
      };
    }

    // Increment share count
    await dbService.incrementProjectShares(projectId);

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/project/${projectId}`;

    // Generate platform-specific share URLs
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(project.title)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(project.title)}`,
      copy: shareUrl
    };

    // Return share URLs
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        shareUrls: shareUrls,
        project: {
          title: project.title,
          description: project.shortDescription,
          thumbnail: project.thumbnail
        }
      })
    };

  } catch (error) {
    console.error('Error in createShareLink:', error);

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