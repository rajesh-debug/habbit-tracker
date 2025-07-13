import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';

const FocusMode = ({ visible, habit, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      showCompletionAlert();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(5 * 60);
  };

  const showCompletionAlert = () => {
    Alert.alert(
      'Focus Session Complete!',
      `Great job focusing on "${habit?.name}". Would you like to mark this habit as completed?`,
      [
        { text: 'Not Yet', style: 'cancel', onPress: resetTimer },
        { 
          text: 'Mark Complete', 
          style: 'default', 
          onPress: () => {
            onComplete(habit.id);
            handleClose();
          }
        },
      ]
    );
  };

  const handleClose = () => {
    setIsActive(false);
    setTimeLeft(5 * 60);
    onClose();
  };

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Focus Mode</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.habitName}>{habit.name}</Text>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((5 * 60 - timeLeft) / (5 * 60)) * 100}%` }
                ]} 
              />
            </View>
          </View>

          <Text style={styles.instructions}>
            {!isActive && timeLeft === 5 * 60 
              ? 'Focus on your habit for 5 minutes. Minimize distractions and give your full attention.'
              : isActive 
                ? 'Stay focused! You can do this.'
                : 'Take a break or continue focusing.'
            }
          </Text>

          <View style={styles.buttonContainer}>
            {!isActive ? (
              <TouchableOpacity 
                style={[styles.button, styles.startButton]} 
                onPress={startTimer}
              >
                <Text style={styles.buttonText}>
                  {timeLeft === 5 * 60 ? 'Start Focus' : 'Resume'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.button, styles.pauseButton]} 
                onPress={pauseTimer}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]} 
              onPress={resetTimer}
            >
              <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
            </TouchableOpacity>
          </View>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 48,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#666',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButtonText: {
    color: '#666',
  },
});

export default FocusMode;