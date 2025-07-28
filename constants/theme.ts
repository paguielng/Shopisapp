export const COLORS = {
  primary: '#2563EB', // Blue 600 - plus professionnel
  primaryLight: '#93C5FD',
  primaryDark: '#1D4ED8',
  secondary: '#0EA5E9', // Sky 500
  tertiary: '#7C3AED', // Violet 600
  accent: '#F59E0B', // Amber 500

  success: '#059669', // Emerald 600
  warning: '#D97706', // Amber 600
  error: '#DC2626', // Red 600

  background: '#FAFBFC', // Gris très clair avec une pointe de bleu
  backgroundLight: '#F1F5F9', // Slate 100
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Texte avec meilleur contraste
  text: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#64748B', // Slate 500
  textLight: '#94A3B8', // Slate 400
  
  // Bordures et séparateurs
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  
  // Couleurs système
  white: '#FFFFFF',
  black: '#000000',
  
  // Alias pour compatibilité
  lightGray: '#E2E8F0',
  gray: '#94A3B8',
};

export const FONTS = {
  // Inter pour le texte courant - excellent pour la lisibilité
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  
  // Manrope pour les titres - moderne et distinctif
  titleRegular: 'Manrope-Regular',
  titleMedium: 'Manrope-Medium',
  titleSemiBold: 'Manrope-SemiBold',
  titleBold: 'Manrope-Bold',
  titleExtraBold: 'Manrope-ExtraBold',
  
  // Alias pour faciliter la transition
  bold: 'Manrope-Bold',
};

export const TYPOGRAPHY = {
  // Titres avec Manrope
  h1: {
    fontFamily: FONTS.titleExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONTS.titleBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: FONTS.titleSemiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: FONTS.titleSemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h5: {
    fontFamily: FONTS.titleMedium,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: FONTS.titleMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Corps de texte avec Inter
  body1: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  
  // Boutons et labels
  button: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Alias pour compatibilité
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};