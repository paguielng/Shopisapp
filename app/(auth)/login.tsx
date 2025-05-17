import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ShoppingBag, Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }

    // In a real app, we would authenticate with a backend
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to the main app
      router.replace('/home');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <ShoppingBag size={64} color={COLORS.primary} />
          <Text style={styles.appName}>ShoppingListApp</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue managing your shopping lists</Text>
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          
          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loginButtonText}>Logging in...</Text>
            ) : (
              <>
                <Text style={styles.loginButtonText}>Log In</Text>
                <ArrowRight color={COLORS.white} size={20} />
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity 
            style={styles.registerLink}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.medium,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.extraLarge,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.extraLarge,
  },
  appName: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginTop: SPACING.small,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.large,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.large,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  inputIcon: {
    marginRight: SPACING.small,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.large,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.medium,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
    marginRight: SPACING.small,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.medium,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginHorizontal: SPACING.small,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
  registerLinkText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  registerHighlight: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});