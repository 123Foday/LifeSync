import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { AppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import {
  User,
  Settings,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  ShieldCheck,
  CreditCard,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { userData, logout } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme as 'light' | 'dark'];

  const MenuItem = ({ icon: Icon, title, value, onPress, showSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? colors.border : '#f5f7ff' }]}>
          <Icon size={20} color={theme === 'dark' ? colors.text : colors.tint} />
        </View>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={[styles.menuValue, { color: colors.icon }]}>{value}</Text>}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.tint }}
            thumbColor={switchValue ? '#fff' : '#f4f3f4'}
          />
        ) : (
          <ChevronRight size={20} color={colors.icon} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.tint }]}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userData?.image || 'https://via.placeholder.com/150' }}
              style={[styles.avatar, { borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)' }]}
            />
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme === 'dark' ? colors.border : '#fff' }]}>
              <Settings size={16} color={colors.tint} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'Login to see details'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: colors.icon }]}>Account Settings</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <MenuItem icon={User} title="Personal Information" />
          <MenuItem icon={CreditCard} title="Payment Methods" value="Visa **** 4242" />
          <MenuItem icon={Bell} title="Notifications" />
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: colors.icon }]}>Preferences</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <MenuItem 
            icon={theme === 'dark' ? Moon : Sun} 
            title="Dark Mode" 
            showSwitch={true} 
            switchValue={theme === 'dark'}
            onSwitchChange={toggleTheme}
          />
          <MenuItem icon={ShieldCheck} title="Privacy & Security" />
        </View>

        {/* Support Section */}
        <Text style={[styles.sectionTitle, { color: colors.icon }]}>Support</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <MenuItem icon={Settings} title="App Settings" />
          <MenuItem icon={Lock} title="About LifeSync" />
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: '#ef4444', borderStyle: 'dashed' }]} 
          onPress={logout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.icon }]}>Version 1.0.0</Text>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 20,
  },
  menuCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    marginRight: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 18,
    marginTop: 30,
    borderWidth: 1,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 30,
  },
});
