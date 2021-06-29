import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export interface HistoryItem {
  politicianId: string;
  date: Date;
}

export class HistoryManager {
  private items: HistoryItem[] | null = null;
  private database: SQLiteDatabase | null = null;

  public async getItems(): Promise<HistoryItem[]> {
    await this.loadItems();
    return this.items!;
  }

  public async pushItem(politicianId: string): Promise<void> {
    const date = new Date();
    await this.openDatabase();
    await this.database!.executeSql(
      'INSERT INTO history(politician_id, date) VALUES (?, ?)',
      [politicianId, date.toISOString()],
    );
    if (this.items) {
      this.items.push({
        politicianId,
        date,
      });
    }
  }

  private async loadItems(): Promise<void> {
    if (this.items) {
      return;
    }

    await this.openDatabase();
    const [{rows}] = await this.database!.executeSql(
      'SELECT politician_id, date FROM history ORDER BY date',
    );
    this.items = rows.raw().map(value => ({
      politicianId: value.politician_id,
      date: new Date(value.date),
    }));
  }

  private async openDatabase(): Promise<void> {
    if (this.database) {
      return;
    }

    this.database = await SQLite.openDatabase({
      name: 'history',
      location: 'Documents',
    });
    await this.database.executeSql(`CREATE TABLE IF NOT EXISTS history (
        id            INTEGER   NOT NULL PRIMARY KEY AUTOINCREMENT,
        politician_id TEXT      NOT NULL,
        date          TIMESTAMP NOT NULL
    )`);
    await this.database.executeSql(
      "DELETE FROM history WHERE date < DATETIME('now', '-1 month')",
    );
  }
}

export const historyManager = new HistoryManager();
