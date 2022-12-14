import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt_decode from 'jwt-decode';
import userTypes from '../configs/user_type';

export function middleware(req: NextRequest, res: NextResponse) {
  const requestHeaders = new Headers(req.headers);
  const authHeader = requestHeaders.get('Authorization');
  // If the token is not set, give authentication error
  if (!authHeader) {
    // set the new response headers
    req.nextUrl.pathname = '/api/handlers/auth_error_401';
    return NextResponse.rewrite(req.nextUrl);
  }
  // Get the user type information
  const token = authHeader.replace('Bearer ', '') || '';
  const decodedToken = parseToken(token);
  const accessType = getUserType(decodedToken);
  const userMail = getUserMail(decodedToken);
  // Set necessary information to the header
  requestHeaders.set('x-access-type', accessType);
  requestHeaders.set('x-access-token', token);
  requestHeaders.set('x-user-mail', userMail);
  // if the user is not admin, block
  if (accessType !== userTypes.admin) {
    if (req.nextUrl.pathname.includes('/admin')) {
      req.nextUrl.pathname = '/api/handlers/auth_error_403';
      return NextResponse.rewrite(req.nextUrl);
    }
  }
  // set the new response headers
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });
  return response;
}

// Limit the middleware to paths
export const config = {
  matcher: ['/api/:function*'],
};

// Decode the token
function parseToken(token: string) {
  const decoded: any = jwt_decode(token);
  return decoded;
}

// parse the token for admin information
function getUserType(decodedToken: any) {
  const accessType = decodedToken.resource_access['theia-cloud'].roles[0];
  return accessType;
}

// parse the token for email
function getUserMail(decodedToken: any) {
  const email = decodedToken.email;
  return email;
}
