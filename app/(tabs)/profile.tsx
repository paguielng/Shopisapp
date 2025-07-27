import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, Settings, LogOut, Moon, BellRing, 
  Wallet, Share2, HelpCircle, Info 
} from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://media.tenor.com/CiRwpB1HP98AAAAe/money-money-money.png',
    listsCount: 8,
    completedItemsCount: 124,
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Erreur lors de la déconnexion');
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode, 
    title: string, 
    value?: boolean, 
    onToggle?: (value: boolean) => void,
    onPress?: () => void
  ) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
        disabled={onToggle !== undefined}
      >
        <View style={styles.settingLeft}>
          {icon}
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
        {onToggle !== undefined && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
            thumbColor={value ? COLORS.primary : COLORS.white}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <Header title="Profile" showBackButton={false} />
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.listsCount}</Text>
              <Text style={styles.statLabel}>Lists</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.completedItemsCount}</Text>
              <Text style={styles.statLabel}>Items Completed</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <User size={16} color={COLORS.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingItem(
            <Moon size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Dark Mode',
            darkMode,
            (value) => setDarkMode(value)
          )}
          
          {renderSettingItem(
            <BellRing size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Notifications',
            notifications,
            (value) => setNotifications(value)
          )}
          
          {renderSettingItem(
            <Wallet size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Offline Mode',
            offlineMode,
            (value) => setOfflineMode(value)
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingItem(
            <Settings size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Account Settings',
            undefined,
            undefined,
            () => router.push('/settings/account')
          )}
          
          {renderSettingItem(
            <Share2 size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Shared Lists',
            undefined,
            undefined,
            () => router.push('/settings/shared-lists')
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem(
            <HelpCircle size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'Help Center',
            undefined,
            undefined,
            () => router.push('/settings/help')
          )}
          
          {renderSettingItem(
            <Info size={20} color={COLORS.primary} style={styles.settingIcon} />,
            'About',
            undefined,
            undefined,
            () => router.push('/settings/about')
          )}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.medium,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '80%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.small,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editProfileText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginLeft: SPACING.small,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: SPACING.medium,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.medium,
    marginVertical: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginLeft: SPACING.small,
  },
  versionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.extraLarge,
  },
});
