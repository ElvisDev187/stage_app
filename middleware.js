
import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase';
/**
 * 
 * @param {import('next/server').NextRequest} request 
 * @returns 
 */
const middleware = async (request) => {
  
  // Get the cookie from the request
  const access_token = request.cookies.get("supabase-auth-token");

  // If the cookie is not set, redirect to the login page
  if (!access_token) {
    return NextResponse.redirect(`${process.env.NextURL}/login`);
  }

  const data = JSON.parse(access_token.value)

  // If the cookie is set, make sure the JWT is valid
  const { data: user, error } = await supabase.auth.getUser(data[0]);
 
  // If the JWT is not valid, redirect to the login page
  if (error || !user) {
    // Here we MUST wipe the access token as well. Otherwise the user will be stuck in a redirect loop.

    return NextResponse.redirect(`${process.env.NextURL}/login`, {
      headers: {
        "Set-Cookie": `${process.env.SUPABASE_COOKIE_KEY}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`, // Manually delete the cookie.
      },
    });
  }
  if (request.url == "http://localhost:3000/login" && user) {
    return NextResponse.redirect(`${process.env.NextURL}/`);
  }
//   // If the JWT is valid, pass the request to the API route or page
  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ["/"], // This is the path we want to protect
};