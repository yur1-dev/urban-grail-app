import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard, CardProps as PaperCardProps } from 'react-native-paper';
import { colors } from '../../theme/colors';

interface CustomCardProps extends Omit<PaperCardProps, 'children'> {
  children?: React.ReactNode;
  variant?: 'elevated' | 'outlined';
  style?: ViewStyle;
}

const Card = ({ variant = 'elevated', style, children, ...props }: CustomCardProps) => {
  return (
    <PaperCard
      mode={variant}
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

export const CardContent = PaperCard.Content;
export const CardTitle = PaperCard.Title;
export const CardActions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    marginBottom: 12,
  },
});

export default Card;
