import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FinanceTracker = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Menyimpan data ke local storage
  const saveTransaction = async (newTransaction) => {
    try {
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
    } catch (e) {
      console.log('Gagal menyimpan transaksi', e);
    }
  };

  // Mengambil data dari local storage
  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions !== null) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (e) {
      console.log('Gagal mengambil transaksi', e);
    }
  };

  // Mengambil transaksi saat aplikasi dibuka kembali
  useEffect(() => {
    loadTransactions();
  }, []);

  // Menambahkan transaksi (pendapatan atau pengeluaran)
  const addTransaction = (type) => {
    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: parseFloat(amount),
      type: type, // "income" untuk pendapatan, "expense" untuk pengeluaran
      date: new Date().toLocaleString(), // Menyimpan tanggal dan waktu
    };

    saveTransaction(newTransaction);
    setAmount(''); // Reset input
    setDescription('');
  };

  // Menghitung total pendapatan dan pengeluaran
  const calculateTotal = (type) => {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Finance Tracker</Text>
      <Text>Total Pendapatan: Rp {calculateTotal('income')}</Text>
      <Text>Total Pengeluaran: Rp {calculateTotal('expense')}</Text>

      <TextInput
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Jumlah"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Tambah Pendapatan" onPress={() => addTransaction('income')} />
      <Button title="Tambah Pengeluaran" onPress={() => addTransaction('expense')} />

      <Text style={{ marginVertical: 20, fontSize: 18 }}>Riwayat Transaksi:</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.description}</Text>
            <Text>{item.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}: Rp {item.amount}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FinanceTracker;
