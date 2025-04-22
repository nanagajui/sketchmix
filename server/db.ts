import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { getDatabaseConfig } from '../config/database';

const dbConfig = getDatabaseConfig();

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: dbConfig.url,
});

export const db = drizzle(pool, { schema });