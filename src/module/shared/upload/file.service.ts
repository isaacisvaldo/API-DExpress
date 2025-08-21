import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import slugify from 'slugify'; // Make sure to install: npm install slugify

@Injectable()
export class FileService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );
  }

  async uploadFile(file: Express.Multer.File) {
    const bucketName = 'files'; 

    // Sanitize the original file name to remove invalid characters
    const sanitizedFileName = slugify(file.originalname, {
      lower: true,
      strict: true,
    });
    
    // Create the final unique filename using the sanitized name
    const fileName = `${Date.now()}-${sanitizedFileName}`;
  
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.log(uploadError);
      throw new Error('Falha no upload para o Supabase.');
    }

    try {
      const { data } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
     
      return { url: data.publicUrl };

    } catch (error) {
      console.log(error);
      throw new Error('Falha ao obter URL público.');
    }
  }
}