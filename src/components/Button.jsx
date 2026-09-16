import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../constants/colors";

const VARIANT_STYLES = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.border },
  danger: { backgroundColor: colors.danger },
};

const VARIANT_TEXT_STYLES = {
  primary: { color: colors.white },
  secondary: { color: colors.primaryDark },
  danger: { color: colors.white },
};

const CustomButton = ({ onPress, title, variant = "primary", disabled = false, loading = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={(VARIANT_TEXT_STYLES[variant] || VARIANT_TEXT_STYLES.primary).color} />
      ) : (
        <Text style={[styles.buttonText, VARIANT_TEXT_STYLES[variant] || VARIANT_TEXT_STYLES.primary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
