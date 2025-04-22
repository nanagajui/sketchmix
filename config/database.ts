interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    url: string;
  }
  
  export function getDatabaseConfig(): DatabaseConfig {
    const useLocalDb = process.env.USE_LOCAL_DB === 'true';
    
    if (useLocalDb) {
      return {
        host: process.env.LOCAL_PGHOST || 'localhost',
        port: parseInt(process.env.LOCAL_PGPORT || '5432'),
        database: process.env.LOCAL_PGDATABASE || 'sketchmix',
        user: process.env.LOCAL_PGUSER || 'postgres',
        password: process.env.LOCAL_PGPASSWORD || 'postgres',
        url: process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sketchmix'
      };
    }
  
    return {
      host: process.env.PROD_PGHOST!,
      port: parseInt(process.env.PROD_PGPORT || '5432'),
      database: process.env.PROD_PGDATABASE!,
      user: process.env.PROD_PGUSER!,
      password: process.env.PROD_PGPASSWORD!,
      url: process.env.PROD_DATABASE_URL!
    };
  }