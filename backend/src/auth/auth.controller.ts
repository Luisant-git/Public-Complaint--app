// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Register first admin user',
    description: 'Create the first admin user. Role is automatically set to Admin.'
  })
  @ApiBody({ type: RegisterDto })
  registerAdmin(@Body() body: RegisterDto) {
    return this.authService.registerAdmin(body);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login with email and password' })
  @ApiBody({ type: AdminLoginDto })
  loginAdmin(@Body() body: AdminLoginDto) {
    return this.authService.loginAdmin(body);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Public user login/registration with Name and Mobile' })
  @ApiBody({ type: UserLoginDto })
  loginUser(@Body() body: UserLoginDto) {
    return this.authService.loginUser(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id, req.user.role);
  }
}