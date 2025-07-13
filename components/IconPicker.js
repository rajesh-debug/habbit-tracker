import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { habitIcons } from '../utils/habitIcons';

const IconPicker = ({ visible, selectedIcon, onSelectIcon, onClose }) => {
  const renderIconItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.iconItem,
        selectedIcon?.id === item.id && styles.selectedIconItem
      ]}
      onPress={() => onSelectIcon(item)}
    >
      <Text style={styles.iconEmoji}>{item.emoji}</Text>
      <Text style={styles.iconLabel} numberOfLines={1}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Choose Icon</Text>
          <TouchableOpacity 
            style={styles.doneButton} 
            onPress={onClose}
            disabled={!selectedIcon}
          >
            <Text style={[styles.doneButtonText, !selectedIcon && styles.disabledText]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Select an icon for your habit</Text>
          
          <FlatList
            data={habitIcons}
            renderItem={renderIconItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            contentContainerStyle={styles.iconGrid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  disabledText: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  iconGrid: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  iconEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default IconPicker;