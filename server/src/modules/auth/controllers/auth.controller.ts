import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { UpdateProfileDto } from '@/modules/auth/dto/update-profile.dto';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Request() req) {
    return this.authService.register(dto, req);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Request() req) {
    return this.authService.login(dto, req);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, dto, req);
  }

  @Patch('password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto, req);
  }
}
