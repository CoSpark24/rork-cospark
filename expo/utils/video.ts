import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Type guard to check if FileInfo has size property
function hasSize(fileInfo: FileSystem.FileInfo): fileInfo is FileSystem.FileInfo & { size: number } {
  return 'size' in fileInfo;
}

// Helper to validate file size
async function isFileValid(uri: string): Promise<boolean> {
  const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
  
  if (!fileInfo.exists) return false;
  if (!hasSize(fileInfo)) return false;
  
  return fileInfo.size <= MAX_VIDEO_SIZE;
}

export async function recordVideo(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') throw new Error('Camera permission not granted');

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      const isValid = await isFileValid(uri);

      if (!isValid) throw new Error('Video must exist and be under 50MB');
      return uri;
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
    if (status !== 'granted') throw new Error('Media library permission not granted');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      const isValid = await isFileValid(uri);

      if (!isValid) throw new Error('Video must exist and be under 50MB');
      return uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    throw error;
  }
}

export async function uploadVideo(uri: string): Promise<string> {
  // Placeholder: Replace with actual upload logic (Firebase/Supabase)
  return uri;
}