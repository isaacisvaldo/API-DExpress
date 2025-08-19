import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';


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
    const fileName = `${Date.now()}-${file.originalname}`;

  
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new Error('Falha no upload para o Supabase.');
    }


    try {

      const { data } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

     
      return { url: data.publicUrl };

    } catch (error) {
      // Trata qualquer erro que possa ocorrer, como arquivo não encontrado
      throw new Error('Falha ao obter URL público.');
    }
  }
}