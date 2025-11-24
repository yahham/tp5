import * as SQLite from 'expo-sqlite';

// 1. Singleton Pattern: Ensure we only open the DB once
let dbInstance = null;

export const getDatabase = async () => {
    if (dbInstance) {
        return dbInstance;
    }
    
    // Open the database (equivalent to Room.databaseBuilder)
    dbInstance = await SQLite.openDatabaseAsync('base_donnees_app.db');
    
    // Perform migrations and initialization
    await migrateDatabase(dbInstance);
    
    return dbInstance;
};

// 2. Migration Logic (Equivalent to MIGRATION_1_2)
const migrateDatabase = async (db) => {
    const DATABASE_VERSION = 2; // Target version defined in your TP

    // Get current version
    let { user_version: currentVersion } = await db.getFirstAsync(
        'PRAGMA user_version'
    );

    console.log(`Current DB Version: ${currentVersion}`);

    if (currentVersion >= DATABASE_VERSION) {
        return; // Already up to date
    }

    // Version 0 -> 1: Create the initial table (The @Entity logic)
    if (currentVersion === 0) {
        console.log('Migrating to version 1: Creating table');
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS utilisateurs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                email TEXT NOT NULL
            );
        `);
        currentVersion = 1;
    }

    // Version 1 -> 2: Add 'age' column (The Migration logic)
    if (currentVersion === 1) {
        console.log('Migrating to version 2: Adding age column');
        await db.execAsync(`
            ALTER TABLE utilisateurs ADD COLUMN age INTEGER NOT NULL DEFAULT 0;
        `);
        currentVersion = 2;
    }

    // Update the local version tracker
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};