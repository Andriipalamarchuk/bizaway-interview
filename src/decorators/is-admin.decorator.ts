import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { requestInfoExtractor } from '../utils/request-info-extractor.util';

export const IsAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext): boolean | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const authObject = requestInfoExtractor(ctx.getContext().req);
    return authObject.isAdmin;
  },
);
