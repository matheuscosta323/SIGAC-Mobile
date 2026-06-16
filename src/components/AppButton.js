import { Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function AppButton({ title, onPress, danger = false }) {
  return (
    <TouchableOpacity style={[globalStyles.button, danger && globalStyles.buttonDanger]} onPress={onPress}>
      <Text style={globalStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}