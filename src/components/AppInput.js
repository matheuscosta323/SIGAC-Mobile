import { TextInput } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function AppInput({ multiline = false, style, ...props }) {
  return (
    <TextInput
      placeholderTextColor="#9ca3af"
      style={[globalStyles.input, multiline && globalStyles.textArea, style]}
      multiline={multiline}
      {...props}
    />
  );
}