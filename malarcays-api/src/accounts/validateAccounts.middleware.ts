﻿import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ValidateAccount implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}