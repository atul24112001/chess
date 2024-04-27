import { Request } from "express";

interface User {
  id: string;
  email: string;
  name: string;
}

interface ExpressRequest extends Request {
  currentUser?: User;
}

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }
