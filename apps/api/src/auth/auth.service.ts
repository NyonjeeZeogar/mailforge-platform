import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
  async getCurrentUser() {
    return {
      id: 'dev-admin',
      name: 'Admin',
      email: 'admin@esp.io',
      role: 'owner',
    };
  }

  async logout(res: Response) {
    res.clearCookie('mailforge_session');
    return { success: true };
  }
}
