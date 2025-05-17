import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export function Header({ title, showBackButton = false, rightContent }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {rightContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  leftContainer: {
    width: 40,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});