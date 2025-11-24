// Equivalent to @Dao interface
export const UtilisateurDao = {
    
    // @Insert
    // suspend fun insererUtilisateur(utilisateur: Utilisateur)
    insertUtilisateur: async (db, nom, email, age) => {
        const result = await db.runAsync(
            'INSERT INTO utilisateurs (nom, email, age) VALUES (?, ?, ?)',
            [nom, email, age] // Parameter binding for security
        );
        return result.lastInsertRowId;
    },

    // @Query("SELECT * FROM utilisateurs")
    // suspend fun getAllUtilisateurs(): List<Utilisateur>
    getAllUtilisateurs: async (db) => {
        const allRows = await db.getAllAsync('SELECT * FROM utilisateurs');
        return allRows;
    },

    // @Delete
    // suspend fun supprimerUtilisateur(utilisateur: Utilisateur)
    deleteUtilisateur: async (db, id) => {
        await db.runAsync('DELETE FROM utilisateurs WHERE id = ?', [id]);
    },
    
    // Helper to clear table (useful for testing)
    deleteAll: async (db) => {
        await db.runAsync('DELETE FROM utilisateurs');
    }
};