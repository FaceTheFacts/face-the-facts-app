import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export interface HistoryItem {
  politicianId: number;
  date: Date;
}

export class DBManager {
  private followedIds: Set<number> | null = null;
  private historyItems: HistoryItem[] | null = null;
  private database: SQLiteDatabase | null = null;

  public constructor(private readonly politicians: Map<string, string>) {}

  public async getFollowedIds(): Promise<Set<number>> {
    await this.loadFollowedIds();
    return this.followedIds!;
  }

  public async getHistoryItems(): Promise<HistoryItem[]> {
    await this.loadHistoryItems();
    return this.historyItems!;
  }

  public async pushHistoryItem(politicianId: number): Promise<void> {
    const date = new Date();
    await this.openDatabase();
    await this.database!.executeSql(
      'DELETE FROM history WHERE politician_id = ?',
      [politicianId.toString()],
    );
    await this.database!.executeSql(
      'INSERT OR IGNORE INTO history(politician_id, date) VALUES (?, ?)',
      [politicianId.toString(), date.toISOString()],
    );
    if (this.historyItems) {
      for (let i = 0; i < this.historyItems.length; i++) {
        if (this.historyItems[i].politicianId === politicianId) {
          this.historyItems.splice(i, 1);
          break;
        }
      }
      this.historyItems.push({
        politicianId,
        date,
      });
    }
  }

  public async isIdFollowed(politicianId: number): Promise<boolean> {
    await this.loadFollowedIds();
    if (this.followedIds!.has(politicianId)) {
      return true;
    }
    return false;
  }

  public async pushFollowId(politicianId: number): Promise<void> {
    const date = new Date();
    await this.openDatabase();
    await this.database!.executeSql(
      'INSERT OR IGNORE INTO follow(id, date) VALUES (?, ?)',
      [politicianId, date.toISOString()],
    );
    this.followedIds!.add(politicianId);
  }

  public async removeFollowedId(politicianId: number): Promise<void> {
    await this.openDatabase();
    await this.database!.executeSql('DELETE FROM follow WHERE id = ?', [
      politicianId,
    ]);
    this.followedIds!.delete(politicianId);
  }

  private async loadHistoryItems(): Promise<void> {
    if (this.historyItems) {
      return;
    }

    await this.openDatabase();
    const [{rows}] = await this.database!.executeSql(
      'SELECT id, politician_id, date FROM history ORDER BY date',
    );
    await Promise.all(
      rows
        .raw()
        .filter(({politician_id}) => !this.politicians.has(politician_id))
        .map(({id}) =>
          this.database!.executeSql('DELETE FROM history WHERE id = ?', [id]),
        ),
    );
    this.historyItems = rows
      .raw()
      .filter(({politician_id}) => this.politicians.has(politician_id))
      .map(({politician_id, date}) => ({
        politicianId: politician_id,
        date: new Date(date),
      }));
  }

  private async loadFollowedIds(): Promise<void> {
    if (this.followedIds) {
      return;
    }

    await this.openDatabase();
    const [{rows}] = await this.database!.executeSql(
      'SELECT id FROM follow ORDER BY date',
    );
    this.followedIds = new Set(rows.raw().map(({id}) => id));
  }

  private async openDatabase(): Promise<void> {
    if (this.database) {
      return;
    }

    this.database = await SQLite.openDatabase({
      name: 'database',
      location: 'Documents',
    });
    await this.database.executeSql(`CREATE TABLE IF NOT EXISTS history (
        id            INTEGER   NOT NULL PRIMARY KEY AUTOINCREMENT,
        politician_id TEXT      NOT NULL UNIQUE,
        date          TIMESTAMP NOT NULL
    )`);
    await this.database.executeSql(`CREATE TABLE IF NOT EXISTS follow (
        id            INTEGER   NOT NULL PRIMARY KEY,
        date          TIMESTAMP NOT NULL
    )`);
    await this.database.executeSql(
      "DELETE FROM history WHERE date < DATETIME('now', '-1 month')",
    );
  }
}
