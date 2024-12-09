import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../user/role.enum'; 
import { ROLES_KEY } from './roles.decorator'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Log the entire user object for debugging
    console.log('User:', request.user);

    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const userRole = request.user?.role;

    // Log the role for debugging
    console.log('User role:', userRole);

    if (!userRole || !roles.includes(userRole)) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
