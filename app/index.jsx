import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDatabase } from "../database/AppDatabase";
import { UtilisateurDao } from "../database/UtilisateurDao";

const Home = () => {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [users, setUsers] = useState([]);
    const [db, setDb] = useState(null);

    // 1. Initialize Database on Mount
    useEffect(() => {
        const initDB = async () => {
            const database = await getDatabase();
            setDb(database);
            loadUsers(database);
        };
        initDB();
    }, []);

    // 2. Load Users (Read)
    const loadUsers = async (database) => {
        const storedUsers = await UtilisateurDao.getAllUtilisateurs(database);
        setUsers(storedUsers);
    };

    // 3. Add User (Create)
    const handleAddUser = async () => {
        if (!db || !nom || !email) return;

        // Parse age, default to 0 if empty (matching your TP logic)
        const ageInt = age ? parseInt(age) : 0;

        await UtilisateurDao.insertUtilisateur(db, nom, email, ageInt);

        // Clear inputs and reload list
        setNom("");
        setEmail("");
        setAge("");
        loadUsers(db);
    };

    // 4. Delete User (Delete)
    const handleDeleteUser = async (id) => {
        if (!db) return;
        await UtilisateurDao.deleteUtilisateur(db, id);
        loadUsers(db);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>TP5: Room (SQLite) Implementation</Text>

            {/* Input Form */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={nom}
                    onChangeText={setNom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Age (New Column)"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                <Button title="Ajouter Utilisateur" onPress={handleAddUser} />
            </View>

            {/* List */}
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <View>
                            <Text style={styles.userText}>
                                {item.nom} ({item.age} ans)
                            </Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDeleteUser(item.id)}
                            style={styles.deleteBtn}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        marginTop: 30,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2, // Android shadow
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 15,
        paddingVertical: 5,
        fontSize: 16,
    },
    userItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    userText: {
        fontSize: 18,
        fontWeight: "600",
    },
    userEmail: {
        color: "gray",
    },
    deleteBtn: {
        backgroundColor: "#ff4444",
        padding: 8,
        borderRadius: 5,
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
});
