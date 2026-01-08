import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { AppContext } from '@/context/AppContext';
import { Search, Filter, Star, Clock, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';

export default function DoctorsScreen() {
  const { doctors } = useContext(AppContext);
  const { theme: themeName } = useTheme();
  const theme = Colors[themeName as 'light' | 'dark'];
  const [search, setSearch] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.speciality.toLowerCase().includes(search.toLowerCase())
  );

  const renderDoctorItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: themeName === 'dark' ? '#1e1e1e' : '#eff6ff' }]} />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <View style={[styles.ratingBox, { backgroundColor: themeName === 'dark' ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb' }]}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>
        <Text style={[styles.speciality, { color: theme.icon }]}>{item.speciality}</Text>
        
        <View style={styles.detailRow}>
          <Clock size={14} color={theme.tint} />
          <Text style={[styles.detailText, { color: theme.icon }]}>10:00 AM - 05:00 PM</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.availabilityRow}>
            <View style={[styles.dot, { backgroundColor: item.available ? '#10b981' : '#ef4444' }]} />
            <Text style={[styles.availabilityText, { color: item.available ? '#10b981' : '#ef4444' }]}>
              {item.available ? 'Available' : 'Busy'}
            </Text>
          </View>
          <TouchableOpacity style={[styles.bookBtn, { backgroundColor: theme.tint }]}>
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Doctors</Text>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Filter size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Search size={20} color={theme.icon} />
        <TextInput
          placeholder="Search by name or speciality"
          placeholderTextColor={theme.icon}
          style={[styles.searchInput, { color: theme.text }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.icon }]}>No doctors found matching your search.</Text>
          </View>
        }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 20,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fbbf24',
    marginLeft: 2,
  },
  speciality: {
    fontSize: 13,
    marginTop: -2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookBtn: {
    backgroundColor: '#5f6FFF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
