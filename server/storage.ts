import { users, creations, type User, type InsertUser, type Creation, type InsertCreation } from "@shared/schema";
import { db } from './db';
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Creation methods
  getCreation(id: number): Promise<Creation | undefined>;
  getAllCreations(): Promise<Creation[]>;
  createCreation(creation: InsertCreation): Promise<Creation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getCreation(id: number): Promise<Creation | undefined> {
    const [creation] = await db.select().from(creations).where(eq(creations.id, id));
    return creation || undefined;
  }
  
  async getAllCreations(): Promise<Creation[]> {
    return await db.select().from(creations);
  }
  
  async createCreation(insertCreation: InsertCreation): Promise<Creation> {
    const [creation] = await db
      .insert(creations)
      .values(insertCreation)
      .returning();
    return creation;
  }
}

export const storage = new DatabaseStorage();
