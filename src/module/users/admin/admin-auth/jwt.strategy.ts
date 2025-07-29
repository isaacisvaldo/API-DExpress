import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }
  /**
   * Valida o token JWT e extrai os dados do usuário.
   * @param payload - Dados decodificados do token JWT.
   * @returns Dados do usuário que serão adicionados ao objeto de requisição.
   */
  async validate(payload: any) {
    // Retorna os dados que ficarão disponíveis em `req.user`
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
