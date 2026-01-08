import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';

export default function AppointmentsScreen() {
  const { theme: themeName } = useTheme();
  const theme = Colors[themeName as 'light' | 'dark'];

  // Dummy data for now - should come from context/API later
  const dummyAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Richard James',
      speciality: 'General physician',
      date: '24 July, 2025',
      time: '10:00 AM',
      image: 'https://via.placeholder.com/100',
      status: 'upcoming'
    },
    {
      id: '2',
      doctorName: 'Dr. Emily Larson',
      speciality: 'Gynecologist',
      date: '26 July, 2025',
      time: '02:30 PM',
      image: 'https://via.placeholder.com/100',
      status: 'upcoming'
    }
  ];

  const renderAppointment = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={[styles.doctorImg, { backgroundColor: themeName === 'dark' ? '#1e1e1e' : '#f5f7ff' }]} />
        <View style={styles.doctorInfo}>
          <Text style={[styles.doctorName, { color: theme.text }]}>{item.doctorName}</Text>
          <Text style={[styles.speciality, { color: theme.icon }]}>{item.speciality}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'upcoming' ? (themeName === 'dark' ? 'rgba(95, 111, 255, 0.1)' : '#f0f4ff') : (themeName === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2') }]}>
          <Text style={[styles.statusText, { color: item.status === 'upcoming' ? '#5f6FFF' : '#ef4444' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.cardFooter}>
        <View style={styles.dateTimeRow}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={theme.tint} />
            <Text style={[styles.infoText, { color: theme.text }]}>{item.date}</Text>
          </View>
          <View style={[styles.infoItem, { marginLeft: 15 }]}>
            <Clock size={16} color={theme.tint} />
            <Text style={[styles.infoText, { color: theme.text }]}>{item.time}</Text>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]}>
            <Text style={[styles.cancelText, { color: theme.icon }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rescheduleBtn, { backgroundColor: themeName === 'dark' ? 'rgba(95, 111, 255, 0.1)' : '#f5f7ff' }]}>
            <Text style={[styles.rescheduleText, { color: theme.tint }]}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Appointments</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: theme.icon }]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: theme.icon }]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#5f6FFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  speciality: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginBottom: 15,
  },
  cardFooter: {
    gap: 15,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  rescheduleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f5f7ff',
    alignItems: 'center',
  },
  rescheduleText: {
    color: '#5f6FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
