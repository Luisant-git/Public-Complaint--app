// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(registerDto: RegisterDto) {
    const adminCount = await this.prisma.admin.count();
    if (adminCount > 0) {
      throw new ConflictException('Admin already exists. Please login.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: 'Admin',
      },
    });

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { password, ...result } = admin;
    return {
      accessToken,
      user: result,
    };
  }

  async loginAdmin(loginDto: AdminLoginDto) {
    const { email, password } = loginDto;

    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...result } = admin;
    return {
      accessToken,
      user: result,
    };
  }

  async loginUser(loginDto: UserLoginDto) {
    const { name, mobile } = loginDto;

    // Find or create public user by mobile
    let user = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          mobile,
        },
      });
    } else if (user.name !== name) {
      // Update name if it changed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    const payload = {
      sub: user.id,
      mobile: user.mobile,
      role: 'User',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        ...user,
        role: 'User',
      },
    };
  }

  async getProfile(userId: number, role: string) {
    if (role === 'Admin' || role === 'SuperAdmin') {
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId },
      });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      const { password, ...result } = admin;
      return result;
    } else {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { ...user, role: 'User' };
    }
  }
}