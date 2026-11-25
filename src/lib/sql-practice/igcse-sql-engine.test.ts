import { describe, it, expect } from 'vitest';
import { executeIgcseSql } from './igcse-sql-engine';
import { CH9_SQL_MISSIONS, checkCh9SqlMission } from './ch9-sql-missions';
import { CH11_WORKSHOP_ACTIVITIES } from '../narrated-lessons/ch11-workshop-activities';

describe('IGCSE Chapter 9 SQL Engine & Student Practice Missions', () => {
  it('blocks non-SELECT statements safely', () => {
    const res = executeIgcseSql('DROP TABLE Stock;');
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/read-only SELECT/i);
  });

  it('catches missing comma between SELECT columns with a clear IGCSE hint', () => {
    const res = executeIgcseSql('SELECT ItemID Quantity FROM Stock;');
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/Missing comma/i);
  });

  it('queries Weather table and returns empty aggregate cleanly', () => {
    const w = executeIgcseSql("SELECT ReadingTime, Temperature FROM Weather WHERE Temperature >= 28.5 ORDER BY Temperature DESC;");
    expect(w.ok).toBe(true);
    expect(w.rows).toEqual([
      ['14:30', 29.0],
      ['15:00', 28.5],
    ]);

    const emptySum = executeIgcseSql("SELECT SUM(Quantity) FROM Stock WHERE Colour = 'Yellow';");
    expect(emptySum.ok).toBe(true);
    expect(emptySum.rows).toEqual([[null]]);

    const emptyCount = executeIgcseSql("SELECT COUNT(*) FROM Stock WHERE Colour = 'Yellow';");
    expect(emptyCount.ok).toBe(true);
    expect(emptyCount.rows).toEqual([[0]]);
  });

  it('validates all 16 Chapter 9 student practice missions against valid SQL queries', () => {
    const validQueries: Record<string, string> = {
      'ch9a-1': 'SELECT ItemName, Price FROM Stock;',
      'ch9a-2': 'SELECT Colour FROM Stock;',
      'ch9a-3': 'SELECT ItemID, Quantity FROM Stock;',
      'ch9b-1': 'SELECT ItemName, Quantity FROM Stock WHERE Quantity < 6 ORDER BY Quantity ASC;',
      'ch9b-2': "SELECT ItemID FROM Stock WHERE Colour = 'Red' AND Quantity >= 5;",
      'ch9b-3': "SELECT ItemID FROM Stock WHERE Colour = 'Blue' OR Quantity = 0;",
      'ch9b-4': 'SELECT ItemName FROM Stock WHERE Ordered = FALSE;',
      'ch9b-5': 'SELECT ItemName, Price FROM Stock ORDER BY Price DESC;',
      'ch9b-6': "SELECT SUM(Quantity) FROM Stock WHERE Colour = 'Blue';",
      'ch9b-7': "SELECT COUNT(*) FROM Stock WHERE Colour = 'Red';",
      'ch9b-8': 'SELECT COUNT(ItemID) FROM Stock WHERE Price >= 8;',
      'ch9b-9': 'SELECT SUM(Quantity) FROM Stock;',
      'ch9b-10': 'SELECT SUM(Quantity) FROM Stock;',
      'ch9c-1': 'SELECT EquipmentName FROM Equipment WHERE Available = TRUE AND Quantity >= 4;',
      'ch9c-2': 'SELECT SUM(Quantity) FROM Equipment WHERE Available = TRUE;',
      'ch9c-3': 'SELECT COUNT(*) FROM Equipment WHERE Available = TRUE;',
    };

    for (const mission of CH9_SQL_MISSIONS) {
      const sql = validQueries[mission.id];
      expect(sql, `Missing test SQL for ${mission.id}`).toBeDefined();
      const check = checkCh9SqlMission(mission, sql);
      expect(check.passed, `${mission.id} failed: ${check.feedback}`).toBe(true);
    }
  });

  it('rejects wrong column order on ch9a-1 and rejects COUNT on ch9b-10', () => {
    const mA1 = CH9_SQL_MISSIONS.find((m) => m.id === 'ch9a-1')!;
    expect(checkCh9SqlMission(mA1, 'SELECT Price, ItemName FROM Stock;').passed).toBe(false);

    const mB10 = CH9_SQL_MISSIONS.find((m) => m.id === 'ch9b-10')!;
    expect(checkCh9SqlMission(mB10, 'SELECT COUNT(Quantity) FROM Stock;').passed).toBe(false);
  });

  it('executes Chapter 11 Sales SQL enrichment queries and keeps teacher solutions out of client manifest', () => {
    expect(executeIgcseSql('SELECT SUM(Quantity) FROM Sales;').rows).toEqual([[15]]);
    expect(executeIgcseSql('SELECT SUM(PricePesewas * Quantity) FROM Sales;').rows).toEqual([[9000]]);
    expect(executeIgcseSql('SELECT COUNT(*) FROM Sales WHERE Quantity < 10;').rows).toEqual([[2]]);

    expect(CH11_WORKSHOP_ACTIVITIES.length).toBe(16);
    const serialized = JSON.stringify(CH11_WORKSHOP_ACTIVITIES);
    expect(serialized).not.toContain('teacherReference');
    expect(serialized).not.toContain('teacherPseudocode');
    expect(serialized).not.toContain('gradingTests');
  });
});
