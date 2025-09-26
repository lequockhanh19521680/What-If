const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

class DatabaseService {
  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.projectsTable = process.env.PROJECTS_TABLE;
    this.usersTable = process.env.USERS_TABLE;
  }

  async saveProject(projectData) {
    const command = new PutCommand({
      TableName: this.projectsTable,
      Item: {
        projectId: projectData.projectId,
        userId: projectData.userId || 'anonymous',
        prompt: projectData.prompt,
        language: projectData.language,
        scenario: projectData.scenario,
        scientificAnalysis: projectData.scientificAnalysis,
        title: projectData.title,
        shortDescription: projectData.shortDescription,
        images: projectData.images,
        video: projectData.video,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        shareCount: 0,
        viewCount: 0
      }
    });

    try {
      await this.docClient.send(command);
      return projectData;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }

  async getProject(projectId) {
    const command = new GetCommand({
      TableName: this.projectsTable,
      Key: { projectId }
    });

    try {
      const result = await this.docClient.send(command);
      return result.Item;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async getUserProjects(userId, limit = 20) {
    const command = new QueryCommand({
      TableName: this.projectsTable,
      IndexName: 'UserProjectsIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false, // Latest first
      Limit: limit
    });

    try {
      const result = await this.docClient.send(command);
      return result.Items || [];
    } catch (error) {
      console.error('Error getting user projects:', error);
      throw error;
    }
  }

  async incrementProjectViews(projectId) {
    const command = new UpdateCommand({
      TableName: this.projectsTable,
      Key: { projectId },
      UpdateExpression: 'ADD viewCount :increment',
      ExpressionAttributeValues: {
        ':increment': 1
      }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error incrementing project views:', error);
    }
  }

  async incrementProjectShares(projectId) {
    const command = new UpdateCommand({
      TableName: this.projectsTable,
      Key: { projectId },
      UpdateExpression: 'ADD shareCount :increment',
      ExpressionAttributeValues: {
        ':increment': 1
      }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error incrementing project shares:', error);
    }
  }

  async updateUserUsage(userId) {
    const timestamp = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: this.usersTable,
      Key: { userId },
      UpdateExpression: 'ADD usageCount :increment SET lastUsed = :timestamp',
      ExpressionAttributeValues: {
        ':increment': 1,
        ':timestamp': timestamp
      }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error updating user usage:', error);
    }
  }

  async getUserUsage(userId) {
    const command = new GetCommand({
      TableName: this.usersTable,
      Key: { userId }
    });

    try {
      const result = await this.docClient.send(command);
      return result.Item || { usageCount: 0 };
    } catch (error) {
      console.error('Error getting user usage:', error);
      return { usageCount: 0 };
    }
  }
}

module.exports = DatabaseService;