// constants/theme.ts

export const Colors = {
  accent: '#dd8560',
  black: '#111111',
  white: '#ffffff',
  offWhite: '#F7F5F2',
  cardBg: '#F5F3F0',

  // Text
  textPrimary: '#222222',
  textSecondary: '#555555',
  textMuted: '#999999',
  textLight: '#bbbbbb',

  // Borders
  borderLight: '#F0F0F0',
  borderMedium: '#E5E5E5',
  borderStrong: '#DEDEDE',

  // UI
  separator: '#F2F2F2',
  inputBg: '#F2F2F2',
  chipBg: '#FAFAFA',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  // Labels / tags
  label: { fontSize: 11, letterSpacing: 1.5, fontWeight: '400' as const },
  // Body
  bodySmall: { fontSize: 12, fontWeight: '300' as const, lineHeight: 18 },
  body: { fontSize: 14, fontWeight: '300' as const, lineHeight: 20 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const },
  // Headings
  sectionTitle: { fontSize: 18, letterSpacing: 6, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  navTitle: { fontSize: 13, letterSpacing: 3, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  // Price
  price: { fontSize: 14, color: '#dd8560', fontWeight: '400' as const },
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 20,
  circle: 999,
};