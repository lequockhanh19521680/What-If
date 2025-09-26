const { v4: uuidv4 } = require('uuid');
const AIService = require('../services/aiService');
const MediaService = require('../services/mediaService');
const DatabaseService = require('../services/databaseService');

const aiService = new AIService();
const mediaService = new MediaService();
const dbService = new DatabaseService();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Generate content request:', JSON.stringify(event, null, 2));

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
    const { prompt, language = 'en', userId = null } = body;

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Check user usage limits for non-authenticated users
    if (!userId) {
      // For anonymous users, we could implement IP-based rate limiting
      // For now, we'll allow it but track it
    } else {
      const userUsage = await dbService.getUserUsage(userId);
      if (userUsage.usageCount >= 5 && !userId) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ 
            error: 'Free usage limit exceeded. Please sign in to continue.',
            requiresAuth: true 
          })
        };
      }
    }

    const projectId = uuidv4();

    // Step 1: Generate scenario and image prompts using Claude
    console.log('Generating scenario with AI...');
    const scenarioData = await aiService.generateScenario(prompt, language);

    // Step 2: Generate images using Stable Diffusion
    console.log('Generating images...');
    const imagesData = await aiService.generateMultipleImages(scenarioData.images);

    // Step 3: Upload images to S3
    console.log('Uploading images to S3...');
    const uploadedImages = await mediaService.uploadMultipleImages(imagesData, projectId);

    // Step 4: Create video slideshow
    console.log('Creating video slideshow...');
    const imageUrls = uploadedImages.map(img => img.url);
    const videoData = await mediaService.createVideoSlideshow(imageUrls, projectId);

    // Step 5: Generate thumbnail for sharing
    const thumbnail = await mediaService.generateThumbnail(uploadedImages[0].url);

    // Step 6: Prepare project data
    const projectData = {
      projectId,
      userId,
      prompt,
      language,
      scenario: scenarioData.scenario,
      scientificAnalysis: scenarioData.scientific_analysis,
      title: scenarioData.title,
      shortDescription: scenarioData.short_description,
      images: uploadedImages.map((img, index) => ({
        url: img.url,
        description: scenarioData.images[index].description,
        key: img.key
      })),
      video: {
        url: videoData.url,
        key: videoData.key
      },
      thumbnail: thumbnail
    };

    // Step 7: Save to database
    console.log('Saving project to database...');
    await dbService.saveProject(projectData);

    // Step 8: Update user usage
    if (userId) {
      await dbService.updateUserUsage(userId);
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        project: projectData,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/project/${projectId}`
      })
    };

  } catch (error) {
    console.error('Error in generateContent:', error);

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