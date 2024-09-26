import { Injectable } from '@nestjs/common';
import { sql } from '../../../db';

@Injectable()
export class AccountsService {
  async login(name: string) {
    try {
      const rows = await sql`
        SELECT * FROM account a
        JOIN details d ON a.details_id = d.details_id
        WHERE d.name = ${name}
      `;

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching account: ${error.message}`);
    }
  }


  async findAllDetails() {
    try {
      const rows = await sql`
        SELECT * FROM details
      `;

      return rows;
    } catch (error) {
      throw new Error(`Error fetching details: ${error.message}`);
    }
  }
}
