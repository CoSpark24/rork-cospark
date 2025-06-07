import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ExtendedFileInfo extends FileSystem.FileInfo {
  size?: number;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

async function getFileSize(uri: string): Promise<number> {
  const fileInfo = (await FileSystem.getInfoAsync(uri)) as ExtendedFileInfo;
  if (!fileInfo.exists) {
    throw new Error('Video file not found');
  }

  // Note: size might still be undefined
  if (fileInfo.size === undefined) {
    console.warn('Warning: File size not provided. Skipping size check.');
    return 0;
  }

  return fileInfo.size;
}

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
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      const size = await getFileSize(uri);

      if (size > MAX_VIDEO_SIZE) {
        throw new Error('Video must be under 50MB');
      }

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

    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      const size = await getFileSize(uri);

      if (size > MAX_VIDEO_SIZE) {
        throw new Error('Video must be under 50MB');
      }

      return uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    throw error;
  }
}

export async function uploadVideo(uri: string): Promise<string> {
  // Placeholder: Replace with Firebase/Supabase upload logic
  return uri;
}
