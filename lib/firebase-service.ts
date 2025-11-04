import { database } from './firebase';
import { ref, push, set, get, onValue, remove } from 'firebase/database';
import { AthleteResult, TestSession } from '@/app/yo-yo/_lib/yoyo-protocol';
import performanceData from '@/app/performance-charts/data/performance.json';

export interface YoYoTestResult {
  id: string;
  timestamp: number;
  date: string;
  testSession: TestSession;
  participants: AthleteResult[];
}

export interface HistoricalResult {
  id: string;
  date: string;
  timestamp: number;
  athleteName: string;
  distance: number;
  status: AthleteResult['status'];
  dropOutShuttle?: number;
  dropOutTime?: number;
  sessionId: string;
}

const YOYO_RESULTS_PATH = 'yoyo-test-results';
const HISTORICAL_RESULTS_PATH = 'yoyo-historical-results';

export class FirebaseYoYoService {
  // Save a complete test session
  static async saveTestSession(testSession: TestSession, participants: AthleteResult[]): Promise<string> {
    try {
      const resultRef = ref(database, YOYO_RESULTS_PATH);
      const newResultRef = push(resultRef);

      const testData: YoYoTestResult = {
        id: newResultRef.key || '',
        timestamp: Date.now(),
        date: new Date().toISOString(),
        testSession,
        participants
      };

      await set(newResultRef, testData);

      // Also save individual results for historical tracking
      await this.saveHistoricalResults(newResultRef.key || '', testData);

      return newResultRef.key || '';
    } catch (error) {
      console.error('Error saving test session:', error);
      throw error;
    }
  }

  // Save individual athlete results for historical tracking
  private static async saveHistoricalResults(sessionId: string, testData: YoYoTestResult): Promise<void> {
    try {
      const historicalRef = ref(database, HISTORICAL_RESULTS_PATH);

      const historicalResults: HistoricalResult[] = testData.participants.map(participant => ({
        id: `${sessionId}-${participant.id}`,
        date: testData.date,
        timestamp: testData.timestamp,
        athleteName: participant.name,
        distance: participant.estimatedDistance,
        status: participant.status,
        dropOutShuttle: participant.dropOutShuttle,
        dropOutTime: participant.dropOutTime,
        sessionId
      }));

      // Save each historical result
      for (const result of historicalResults) {
        const resultRef = push(historicalRef);
        await set(resultRef, result);
      }
    } catch (error) {
      console.error('Error saving historical results:', error);
      throw error;
    }
  }

  // Get all test sessions
  static async getAllTestSessions(): Promise<YoYoTestResult[]> {
    try {
      const resultsRef = ref(database, YOYO_RESULTS_PATH);
      const snapshot = await get(resultsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();
      return Object.values(data) as YoYoTestResult[];
    } catch (error) {
      console.error('Error getting test sessions:', error);
      throw error;
    }
  }

  // Get historical results for a specific athlete
  static async getAthleteHistory(athleteName: string): Promise<HistoricalResult[]> {
    try {
      const allSessions = await this.getAllTestSessions();
      const historicalResults: HistoricalResult[] = [];

      allSessions.forEach(session => {
        session.participants.forEach(participant => {
          if (participant.name === athleteName) {
            historicalResults.push({
              id: `${session.id}-${participant.id}`,
              date: session.date,
              timestamp: session.timestamp,
              athleteName: participant.name,
              distance: participant.estimatedDistance,
              status: participant.status,
              dropOutShuttle: participant.dropOutShuttle,
              dropOutTime: participant.dropOutTime,
              sessionId: session.id
            });
          }
        });
      });

      return historicalResults.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting athlete history:', error);
      throw error;
    }
  }

  // Get all historical results
  static async getAllHistoricalResults(): Promise<HistoricalResult[]> {
    try {
      const historicalRef = ref(database, HISTORICAL_RESULTS_PATH);
      const snapshot = await get(historicalRef);

      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();
      return Object.values(data).sort((a: any, b: any) => b.timestamp - a.timestamp) as HistoricalResult[];
    } catch (error) {
      console.error('Error getting historical results:', error);
      throw error;
    }
  }

  // Listen to real-time updates for historical results
  static subscribeToHistoricalResults(callback: (results: HistoricalResult[]) => void): () => void {
    const historicalRef = ref(database, HISTORICAL_RESULTS_PATH);

    const unsubscribe = onValue(historicalRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const results = Object.values(data).sort((a: any, b: any) => b.timestamp - a.timestamp) as HistoricalResult[];
        callback(results);
      } else {
        callback([]);
      }
    });

    return unsubscribe;
  }

  // Delete a test session
  static async deleteTestSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = ref(database, `${YOYO_RESULTS_PATH}/${sessionId}`);
      await remove(sessionRef);

      // Also delete related historical results
      const allHistorical = await this.getAllHistoricalResults();
      const toDelete = allHistorical.filter(result => result.sessionId === sessionId);

      for (const result of toDelete) {
        const resultRef = ref(database, `${HISTORICAL_RESULTS_PATH}/${result.id}`);
        await remove(resultRef);
      }
    } catch (error) {
      console.error('Error deleting test session:', error);
      throw error;
    }
  }

  // Get best performance for each athlete
  static async getAthleteBestPerformances(): Promise<Record<string, { distance: number; date: string; sessionId: string }>> {
    try {
      const historicalResults = await this.getAllHistoricalResults();
      const bestPerformances: Record<string, { distance: number; date: string; sessionId: string }> = {};

      historicalResults.forEach(result => {
        if (!bestPerformances[result.athleteName] || result.distance > bestPerformances[result.athleteName].distance) {
          bestPerformances[result.athleteName] = {
            distance: result.distance,
            date: result.date,
            sessionId: result.sessionId
          };
        }
      });

      return bestPerformances;
    } catch (error) {
      console.error('Error getting best performances:', error);
      throw error;
    }
  }

  // Clear all historical data
  static async clearAllHistoricalData(): Promise<void> {
    try {
      const historicalRef = ref(database, HISTORICAL_RESULTS_PATH);
      await set(historicalRef, null);
      console.log('All historical data cleared');
    } catch (error) {
      console.error('Error clearing historical data:', error);
      throw error;
    }
  }

  // Clear all test sessions
  static async clearAllTestSessions(): Promise<void> {
    try {
      const sessionsRef = ref(database, YOYO_RESULTS_PATH);
      await set(sessionsRef, null);
      console.log('All test sessions cleared');
    } catch (error) {
      console.error('Error clearing test sessions:', error);
      throw error;
    }
  }

  // Import yoyoIr1 data from performance.json as historical data (replaces all existing data)
  static async importYoYoIr1Data(replaceAll: boolean = false): Promise<void> {
    try {
      const yoyoIr1Data = performanceData.yoyoIr1;
      if (!yoyoIr1Data || yoyoIr1Data.length === 0) {
        console.log('No yoyoIr1 data found to import');
        return;
      }

      // If replaceAll is true, clear all existing data first
      if (replaceAll) {
        await this.clearAllHistoricalData();
        await this.clearAllTestSessions();
      } else {
        // Check if data already exists
        const existingResults = await this.getAllHistoricalResults();
        const hasImportedData = existingResults.some(result =>
          result.sessionId === 'yoyoIr1-import'
        );

        if (hasImportedData) {
          console.log('yoyoIr1 data already imported');
          return;
        }
      }

      const historicalRef = ref(database, HISTORICAL_RESULTS_PATH);
      const importTimestamp = Date.now();
      const importDate = new Date(importTimestamp).toISOString();

      // Create historical results for each athlete
      for (const athlete of yoyoIr1Data) {
        const historicalResult: HistoricalResult = {
          id: `yoyoIr1-import-${athlete.name}`,
          date: importDate,
          timestamp: importTimestamp,
          athleteName: athlete.name,
          distance: athlete.value,
          status: 'completed' as const,
          sessionId: 'yoyoIr1-import'
        };

        const resultRef = push(historicalRef);
        await set(resultRef, historicalResult);
      }

      console.log(`Successfully imported ${yoyoIr1Data.length} yoyoIr1 results`);
    } catch (error) {
      console.error('Error importing yoyoIr1 data:', error);
      throw error;
    }
  }
}