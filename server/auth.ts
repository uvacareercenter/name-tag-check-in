import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
require('dotenv').config();

const middleware = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.VITE_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.VITE_AUTH0_AUDIENCE,
  issuer: `https://${process.env.VITE_AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export default middleware;
