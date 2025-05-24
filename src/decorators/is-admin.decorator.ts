import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { requestInfoExtractor } from '../utils/request-info-extractor.util';

export const IsAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext): boolean | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const authObject = requestInfoExtractor(ctx.getContext().req);
    if (!authObject.isAdmin) {
      throw new BadRequestException('User should be logged in');
    }

    return authObject.isAdmin;
  },
);
