import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { requestInfoExtractor } from '../../../utils/request-info-extractor.util';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const authObject = requestInfoExtractor(ctx.getContext().req);
    if (!authObject.isAdmin) {
      throw new UnauthorizedException('User should be admin');
    }
    return true;
  }
}
