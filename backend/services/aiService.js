const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

class AIService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.BEDROCK_REGION || "us-east-1",
    });
  }

  detectLanguage(prompt) {
    // Simple language detection based on character patterns and common words
    const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    const vietnameseWords = /\b(gì|là|của|với|trong|một|này|đó|và|hay|thì|sẽ|đã|có|được|không|nếu|như|để|về|từ|khi|nào|tại|do|theo|qua|bằng|cho|đến|sau|trước|giữa|ngoài|trong|trên|dưới)\b/i;
    
    // Check for Vietnamese characters or common Vietnamese words
    if (vietnameseChars.test(prompt) || vietnameseWords.test(prompt)) {
      return 'vi';
    }
    
    return 'en'; // Default to English
  }

  async generateScenario(prompt, language = null) {
    // Auto-detect language if not provided
    const detectedLanguage = language || this.detectLanguage(prompt);
    const systemPrompt =
      detectedLanguage === "vi"
        ? `Bạn là một AI chuyên gia phân tích khoa học và sáng tạo kịch bản. Nhiệm vụ của bạn là:
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
      }`
        : `You are an expert AI for scientific analysis and creative scenario generation. Your tasks:
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
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    try {
      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        body: JSON.stringify(payload),
        contentType: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      // Parse the JSON response from Claude
      let content = responseBody.content[0].text;
      // Loại bỏ các ký tự điều khiển không hợp lệ
      content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          // Kiểm tra images hợp lệ
          if (
            !parsed.images ||
            !Array.isArray(parsed.images) ||
            parsed.images.length === 0
          ) {
            console.error("Claude response missing images:", parsed);
            throw new Error(
              "Claude did not return any images in the scenario response"
            );
          }
          return parsed;
        } catch (err) {
          throw new Error(
            "Claude returned invalid JSON after cleaning: " + err.message
          );
        }
      } else {
        throw new Error("Invalid JSON response from Claude");
      }
    } catch (error) {
      console.error("Error generating scenario:", error);
      throw error;
    }
  }

  async generateImage(prompt, seed = null) {
    const payload = {
      text_prompts: [
        {
          text: `${prompt}, highly detailed, professional concept art, digital art, trending on artstation, 8k resolution`,
          weight: 1,
        },
      ],
      cfg_scale: 10,
      seed: seed || Math.floor(Math.random() * 1000000),
      steps: 50,
      width: 1024,
      height: 1024,
      samples: 1,
      style_preset: "enhance",
    };

    try {
      const command = new InvokeModelCommand({
        modelId: "stability.stable-diffusion-xl-v1",
        body: JSON.stringify(payload),
        contentType: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      if (responseBody.artifacts && responseBody.artifacts.length > 0) {
        return {
          base64: responseBody.artifacts[0].base64,
          seed: responseBody.artifacts[0].seed,
        };
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  async generateMultipleImages(imagePrompts) {
    const images = [];

    // Enhanced prompt processing for better context-aware image generation
    for (let i = 0; i < imagePrompts.length; i++) {
      try {
        const enhancedPrompt = this.enhanceImagePrompt(imagePrompts[i].prompt, i, imagePrompts.length);
        const imageData = await this.generateImage(enhancedPrompt);
        images.push({
          ...imageData,
          description: imagePrompts[i].description,
          originalPrompt: imagePrompts[i].prompt,
          enhancedPrompt: enhancedPrompt,
          index: i,
        });

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating image ${i}:`, error);
        // Continue with other images even if one fails
      }
    }

    return images;
  }

  enhanceImagePrompt(originalPrompt, index, totalImages) {
    // Add context-specific enhancements based on image position in sequence
    let styleModifier = '';
    
    switch (index) {
      case 0:
        styleModifier = 'establishing shot, wide angle, cinematic composition';
        break;
      case 1:
        styleModifier = 'medium shot, detailed focus, dramatic lighting';
        break;
      case 2:
        styleModifier = 'close-up details, high contrast, dynamic perspective';
        break;
      case 3:
        styleModifier = 'epic finale shot, dramatic atmosphere, wide vista';
        break;
      default:
        styleModifier = 'high quality, detailed, professional';
    }

    // Determine art style based on content analysis
    const artStyle = this.determineArtStyle(originalPrompt);
    
    return `${originalPrompt}, ${styleModifier}, ${artStyle}, highly detailed, professional concept art, 8k resolution, trending on artstation`;
  }

  determineArtStyle(prompt) {
    const prompt_lower = prompt.toLowerCase();
    
    // Science fiction themes
    if (prompt_lower.includes('space') || prompt_lower.includes('alien') || 
        prompt_lower.includes('future') || prompt_lower.includes('robot')) {
      return 'sci-fi digital art, cyberpunk aesthetics, neon lighting';
    }
    
    // Historical themes
    if (prompt_lower.includes('ancient') || prompt_lower.includes('medieval') || 
        prompt_lower.includes('history') || prompt_lower.includes('past')) {
      return 'historical realism, period-accurate details, classical art style';
    }
    
    // Nature/Environment themes
    if (prompt_lower.includes('nature') || prompt_lower.includes('forest') || 
        prompt_lower.includes('ocean') || prompt_lower.includes('mountain')) {
      return 'photorealistic nature photography, natural lighting, environmental art';
    }
    
    // Fantasy themes
    if (prompt_lower.includes('magic') || prompt_lower.includes('fantasy') || 
        prompt_lower.includes('dragon') || prompt_lower.includes('wizard')) {
      return 'fantasy art, magical realism, ethereal lighting';
    }
    
    // Default to realistic style
    return 'photorealistic, natural lighting, professional photography style';
  }
}

module.exports = AIService;
