import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;


    const adminLinkedinIds = process.env.ADMIN_LINKEDIN_IDS.split(',')


    return adminLinkedinIds.includes(user.linkedinId);
  }

}

