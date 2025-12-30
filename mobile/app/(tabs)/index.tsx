import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { AppContext } from '@/context/AppContext';
import { Search, MapPin, Star, ChevronRight, Bell } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const specialities = [
  { name: 'General physician', emoji: '🩺' },
  { name: 'Gynecologist', emoji: '🤰' },
  { name: 'Dermatologist', emoji: '✨' },
  { name: 'Pediatricians', emoji: '👶' },
  { name: 'Neurologist', emoji: '🧠' },
  { name: 'Gastroenterologist', emoji: '🩹' },
];

export default function HomeScreen() {
  const { doctors, hospitals } = useContext(AppContext);
  const { theme: themeName } = useTheme();
  const theme = Colors[themeName as 'light' | 'dark'];
  const router = useRouter();
  const [search, setSearch] = useState('');

  const renderDoctorItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.doctorCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={[styles.doctorImage, { backgroundColor: themeName === 'dark' ? '#0f172a' : '#eff6ff' }]} />
      <View style={styles.doctorInfo}>
        <View style={styles.availabilityRow}>
          <View style={[styles.dot, { backgroundColor: item.available ? '#10b981' : '#ef4444' }]} />
          <Text style={[styles.availabilityText, { color: item.available ? '#10b981' : '#ef4444' }]}>
            {item.available ? 'Available' : 'Busy'}
          </Text>
        </View>
        <Text style={[styles.doctorName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.specialityText, { color: theme.icon }]}>{item.speciality}</Text>
        <View style={styles.ratingRow}>
          <Star size={12} color="#fbbf24" fill="#fbbf24" />
          <Text style={[styles.ratingText, { color: theme.icon }]}>4.8</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.icon }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: theme.text }]}>Patient</Text>
        </View>
        <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Bell size={22} color={theme.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Search size={20} color={theme.icon} />
        <TextInput
          placeholder="Search doctors, hospitals..."
          placeholderTextColor={theme.icon}
          style={[styles.searchInput, { color: theme.text }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Hero Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>AI Health{"\n"}Advisor</Text>
          <Text style={styles.bannerSubtitle}>Chat with our bot for instant advice</Text>
          <TouchableOpacity 
            style={styles.bannerBtn}
            onPress={() => router.push('/medical-advisor')}
          >
            <Text style={styles.bannerBtnText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerImageContainer}>
           <Image
            source={require('@/assets/images/header_img.png')}
            style={styles.bannerImage}
           />
        </View>
      </View>

      {/* Specialities */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Specialities</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: theme.tint }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialityList}>
        {specialities.map((item: any, index: number) => (
          <TouchableOpacity key={index} style={styles.specialityItem}>
            <View style={[styles.specialityIcon, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={styles.specialityEmoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.specialityName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Top Doctors */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Doctors</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text style={[styles.seeAll, { color: theme.tint }]}>Find more</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={doctors.slice(0, 4)}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.doctorGrid}
      />

      {/* Featured Hospitals */}
      <View style={[styles.sectionHeader, { marginTop: 25 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Hospitals</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: theme.tint }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hospitalList}>
        {hospitals.slice(0, 3).map((item, index) => (
          <TouchableOpacity key={index} style={[styles.hospitalCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Image source={{ uri: item.image }} style={styles.hospitalImage} />
            <View style={styles.hospitalBadge}>
              <Text style={styles.hospitalBadgeText}>Top Rated</Text>
            </View>
            <View style={styles.hospitalInfo}>
              <Text style={[styles.hospitalName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
              <View style={styles.addressRow}>
                <MapPin size={12} color={theme.tint} />
                <Text style={[styles.addressText, { color: theme.icon }]} numberOfLines={1}>{item.speciality}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 100 }} />
    </ScrollView>
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
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    backgroundColor: '#ef4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: theme.background,
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
  banner: {
    backgroundColor: themeName === 'dark' ? '#4a58e6' : '#5f6FFF',
    marginHorizontal: 20,
    borderRadius: 24,
    height: 160,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 25,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  bannerBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 15,
  },
  bannerBtnText: {
    color: '#5f6FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bannerImageContainer: {
    width: 130,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
  },
  bannerImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    color: '#5f6FFF',
    fontWeight: '600',
  },
  specialityList: {
    paddingLeft: 20,
    paddingBottom: 25,
  },
  specialityItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  specialityIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  specialityEmoji: {
    fontSize: 30,
  },
  specialityName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  doctorGrid: {
    paddingHorizontal: 15,
  },
  doctorCard: {
    flex: 1,
    margin: 5,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  doctorImage: {
    width: '100%',
    height: 110,
    borderRadius: 15,
  },
  doctorInfo: {
    marginTop: 10,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  specialityText: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
  },
  hospitalList: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
  hospitalCard: {
    width: width * 0.7,
    marginRight: 15,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  hospitalImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  hospitalBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  hospitalBadgeText: {
    color: '#5f6FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  hospitalInfo: {
    padding: 15,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addressText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
});
