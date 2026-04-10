import { Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('mailforge_session');
    return { success: true };
  }

  @Get('me')
  getCurrentUser() {
    return {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
  }
}