import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, Modal
} from 'react-native';

const API_URL = 'http://192.168.1.10:5001/app/users'; // Reemplaza por tu IP 

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setNombre(user.nombre);
      setEmail(user.email);
      setPassword(user.password); 
      setEditingId(user.id);
    } else {
      setNombre('');
      setEmail('');
      setPassword('');
      setEditingId(null);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }) 
      });

      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => openModal(item)} />
        <Button title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>
      <Button title="Crear Nuevo Usuario" onPress={() => openModal()} />

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>ID</Text>
        <Text style={[styles.cell, styles.header]}>Nombre</Text>
        <Text style={[styles.cell, styles.header]}>Email</Text>
        <Text style={[styles.header]}>Acciones</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
      />

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Guardar" onPress={handleSave} />
            <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 5, marginBottom: 5 },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: '#ccc' },
  cell: { flex: 1, paddingHorizontal: 4 },
  header: { fontWeight: 'bold' },
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  modalContainer: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10
  }
});
