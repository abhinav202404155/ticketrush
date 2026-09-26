import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "2h";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

/** Express middleware: rejects the request unless a valid Bearer token is present. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }
  const token = header.slice("Bearer ".length);
  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
