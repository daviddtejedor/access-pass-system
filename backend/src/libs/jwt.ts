import jwt from "jsonwebtoken";

export const generateToken = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "1h" }, (err, token) => {
      if (err || !token) return reject(err);
      resolve(token);
    });
  });
};