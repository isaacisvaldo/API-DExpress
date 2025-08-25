/**
 * Interface que representa o payload do token JWT validado pela JwtStrategy.
 * Essa estrutura define as informações do usuário que estarão disponíveis
 * no objeto de requisição (req.user) após a autenticação.
 */

import { PermissionType } from "src/common/enums/permission.type";
export interface JwtPayload {
  /**
   * O ID do usuário, geralmente vindo do "sub" (subject) do JWT.
   */
  sub: string;

  /**
   * O endereço de e-mail do usuário.
   */
  email: string;

  /**
   * O nome do usuário.
   */
  name: string;

  /**
   * O papel (role) do usuário no sistema.
   */
  role: string;
    /**
   * O papel (avatar) do usuário no sistema.
   */
  avatar: string;

  /**
   * Um array com as permissões do usuário, usando o enum PermissionType.
   */
  permissions: PermissionType[];
}
