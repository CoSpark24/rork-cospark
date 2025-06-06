import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export async function recordVideo(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission not granted');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
      videoMaxDuration: 60, // 1 minute max
    });

    if (!result.canceled && result.assets[0].uri) {
      // Get video file info
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      
      // Check if file exists and has size info
      if (!fileInfo.exists) {
        throw new Error('Video file not found');
      }

      // Check if video is under 50MB
      const fileSize = (await FileSystem.getInfoAsync(result.assets[0].uri, { size: true })).size ?? 0;
      if (fileSize > 50 * 1024 * 1024) {
        throw new Error('Video must be under 50MB');
      }

      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error recording video:', error);
    throw error;
  }
}

export async function pickVideo(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0].uri) {
      // Check if file exists and has size info
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      
      if (!fileInfo.exists) {
        throw new Error('Video file not found');
      }

      // Check if video is under 50MB
      const fileSize = (await FileSystem.getInfoAsync(result.assets[0].uri, { size: true })).size ?? 0;
      if (fileSize > 50 * 1024 * 1024) {
        throw new Error('Video must be under 50MB');
      }

      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    throw error;
  }
}

export async function uploadVideo(uri: string): Promise<string> {
  // TODO: Implement video upload to cloud storage
  // This is a placeholder that returns the local URI
  // In production, you would upload to Firebase Storage or similar
  return uri;
}