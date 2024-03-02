import { Play } from "lucide-react-native";
import { View } from "react-native";

export default function Home() {
  return (
    <View className="flex flex-row items-center w-full h-full justify-center">
      <View className="bg-gray-500">
        <Play />
      </View>
    </View>
  );
}
