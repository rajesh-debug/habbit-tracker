import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProgressChart = ({ habits }) => {
  if (!habits || habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add some habits to see your progress!</Text>
      </View>
    );
  }

  // Prepare data for chart (limit to 10 habits for performance)
  const chartHabits = habits.slice(0, 10);
  const labels = chartHabits.map(habit => 
    habit.name.length > 8 ? habit.name.substring(0, 8) + '...' : habit.name
  );
  const data = chartHabits.map(habit => habit.streak);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
    barPercentage: 0.7,
  };

  const chartData = {
    labels,
    datasets: [
      {
        data: data.length > 0 ? data : [0], // Ensure at least one data point
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Progress</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={chartData}
          width={Math.max(screenWidth - 32, labels.length * 60)} // Dynamic width based on number of habits
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=" days"
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
        />
      </ScrollView>
      {habits.length > 10 && (
        <Text style={styles.limitText}>
          Showing first 10 habits. You have {habits.length} total habits.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  limitText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ProgressChart;