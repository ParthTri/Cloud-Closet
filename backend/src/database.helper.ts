import * as sql from 'mssql';
require('dotenv').config();

export class DatabaseHelper {
  private config: sql.config;

  constructor() {
    this.config = {
      user: process.env['DB_USER'],
      password: process.env['DB_PASS'],
      server: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']),
      database: 'CloudClosetDB',
      authentication: {
        type: 'default',
      },
      options: {
        encrypt: true,
      },
    };
  }

  // Function to connect to the database
  private async connectToDatabase(): Promise<sql.ConnectionPool> {
    try {
      const pool = await sql.connect(this.config);
      //console.log('Connected to the database.');
      return pool;
    } catch (err) {
      console.error('Database connection failed: ', err.message);
      throw err;
    }
  }

  // Function to query the database
  // Function to query the database
  async queryDatabase(query: string): Promise<sql.IResult<any>> {
    let pool: sql.ConnectionPool | undefined;
    try {
      pool = await this.connectToDatabase();
      //console.log('Reading rows from the Table...');

      // Perform the query and return the result set
      const resultSet = await pool.request().query(query);

      // Return the result set
      return resultSet?.recordsets[0] ?? resultSet;
    } catch (err) {
      console.error('Query failed: ', err.message);
      throw err;
    } finally {
      // Ensure the connection is closed
      if (pool) {
        await sql.close();
      }
    }
  }
}
