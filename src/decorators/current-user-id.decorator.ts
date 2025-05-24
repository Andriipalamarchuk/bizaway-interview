import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { requestInfoExtractor } from '../utils/request-info-extractor.util';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const authObject = requestInfoExtractor(ctx.getContext().req)
    if (!authObject.userId) {
      throw new BadRequestException('User should be logged in');
    }

    return authObject.userId;
  },
);
