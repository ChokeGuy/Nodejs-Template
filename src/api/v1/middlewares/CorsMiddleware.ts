import { CorsOptions } from "cors";
const whitelist = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://production-host.com",
];
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    if (whitelist.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
export default corsOptions;
