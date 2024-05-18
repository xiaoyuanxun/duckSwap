import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

class Database {
  private static instance: Database;
  private pool: Pool;
  private client?: PoolClient;

  private constructor() {
    this.pool = new Pool({
      user: 'your_username',
      host: 'localhost',
      database: 'your_database',
      password: 'your_password',
      port: 5432,
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      this.client = await this.pool.connect();
      console.log('Database connected');
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = undefined;
      console.log('Database disconnected');
    }
  }

  public async query<T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('Database not connected');
    }
    return this.client.query<T>(text, params);
  }

  public async createTable(): Promise<void> {
    const queryText = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `;
    await this.query(queryText);
  }

  public async insertUser(firstName: string, lastName: string, email: string): Promise<void> {
    const queryText = 'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)';
    await this.query(queryText, [firstName, lastName, email]);
  }

  public async getUserById(id: number): Promise<QueryResult<any>> {
    const queryText = 'SELECT * FROM users WHERE id = $1';
    return this.query(queryText, [id]);
  }

  public async updateUser(id: number, firstName: string, lastName: string, email: string): Promise<void> {
    const queryText = 'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4';
    await this.query(queryText, [firstName, lastName, email, id]);
  }

  public async deleteUser(id: number): Promise<void> {
    const queryText = 'DELETE FROM users WHERE id = $1';
    await this.query(queryText, [id]);
  }
}

export default Database;
