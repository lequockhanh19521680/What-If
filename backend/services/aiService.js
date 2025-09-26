const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class AIService {
  constructor() {
    this.client = new BedrockRuntimeClient({ 
      region: process.env.BEDROCK_REGION || 'us-east-1' 
    });
  }

  async generateScenario(prompt, language = 'en') {
    const systemPrompt = language === 'vi' ? 
      `Bạn là một AI chuyên gia phân tích khoa học và sáng tạo kịch bản. Nhiệm vụ của bạn là:
      1. Phân tích giả định một cách khoa học và logic
      2. Tạo ra một kịch bản chi tiết với chiều sâu khoa học
      3. Đưa ra 4 mô tả hình ảnh concept art chất lượng cao
      4. Tạo tiêu đề hấp dẫn và mô tả ngắn gọn cho chia sẻ
      
      Trả lời bằng JSON với cấu trúc:
      {
        "scenario": "Mô tả kịch bản chi tiết",
        "scientific_analysis": "Phân tích khoa học",
        "images": [
          {"prompt": "Mô tả hình ảnh 1", "description": "Giải thích"},
          {"prompt": "Mô tả hình ảnh 2", "description": "Giải thích"},
          {"prompt": "Mô tả hình ảnh 3", "description": "Giải thích"},
          {"prompt": "Mô tả hình ảnh 4", "description": "Giải thích"}
        ],
        "title": "Tiêu đề hấp dẫn",
        "short_description": "Mô tả ngắn gọn"
      }` :
      `You are an expert AI for scientific analysis and creative scenario generation. Your tasks:
      1. Analyze the hypothesis scientifically and logically
      2. Create a detailed scenario with scientific depth
      3. Generate 4 high-quality concept art image descriptions
      4. Create an engaging title and short description for sharing
      
      Respond in JSON format:
      {
        "scenario": "Detailed scenario description",
        "scientific_analysis": "Scientific analysis",
        "images": [
          {"prompt": "Image 1 description", "description": "Explanation"},
          {"prompt": "Image 2 description", "description": "Explanation"},
          {"prompt": "Image 3 description", "description": "Explanation"},
          {"prompt": "Image 4 description", "description": "Explanation"}
        ],
        "title": "Engaging title",
        "short_description": "Brief description"
      }`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: prompt
      }]
    };

    try {
      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        body: JSON.stringify(payload),
        contentType: "application/json"
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Parse the JSON response from Claude
      const content = responseBody.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from Claude');
      }
    } catch (error) {
      console.error('Error generating scenario:', error);
      throw error;
    }
  }

  async generateImage(prompt, seed = null) {
    const payload = {
      text_prompts: [
        {
          text: `${prompt}, highly detailed, professional concept art, digital art, trending on artstation, 8k resolution`,
          weight: 1
        }
      ],
      cfg_scale: 10,
      seed: seed || Math.floor(Math.random() * 1000000),
      steps: 50,
      width: 1024,
      height: 1024,
      samples: 1,
      style_preset: "enhance"
    };

    try {
      const command = new InvokeModelCommand({
        modelId: "stability.stable-diffusion-xl-v1",
        body: JSON.stringify(payload),
        contentType: "application/json"
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      if (responseBody.artifacts && responseBody.artifacts.length > 0) {
        return {
          base64: responseBody.artifacts[0].base64,
          seed: responseBody.artifacts[0].seed
        };
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async generateMultipleImages(imagePrompts) {
    const images = [];
    
    for (let i = 0; i < imagePrompts.length; i++) {
      try {
        const imageData = await this.generateImage(imagePrompts[i].prompt);
        images.push({
          ...imageData,
          description: imagePrompts[i].description,
          index: i
        });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating image ${i}:`, error);
        // Continue with other images even if one fails
      }
    }
    
    return images;
  }
}

module.exports = AIService;