import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../../../lib/auth';

import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import { generateLink } from '../../../../../shared/utils/route.utils.js';

@Controller(generateLink({ route: [API_ROUTES.AUTH.BASE] }))
export class AuthController {
  @All(API_ROUTES.AUTH.WILDCARD)
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Convert Express request to Web API Request for better-auth
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });

    const response = await auth.handler(webRequest);

    // Convert Web API Response back to Express response
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);
    const body = await response.json();
    res.json(body);
  }
}
