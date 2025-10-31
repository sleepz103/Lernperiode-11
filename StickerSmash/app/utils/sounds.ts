import { Audio } from 'expo-av';

class SoundManager {
  private clickSound: Audio.Sound | null = null;
  private isLoaded = false;

  async loadSounds() {
    try {
      if (!this.isLoaded) {
        console.log('Loading sounds...');
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/click.wav'),
          { shouldPlay: false }
        );
        this.clickSound = sound;
        this.isLoaded = true;
        console.log('Sounds loaded successfully');
      }
    } catch (error) {
      console.error('Failed to load sounds:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  async playClick() {
    try {
      console.log('Attempting to play click sound...');
      console.log('Sound loaded status:', this.isLoaded);
      if (!this.clickSound) {
        console.warn('Click sound not loaded yet');
        return;
      }
      if (!this.isLoaded) {
        console.warn('Sounds not initialized');
        return;
      }
      await this.clickSound.replayAsync();
      console.log('Click sound played successfully');
    } catch (error) {
      console.error('Error playing click sound:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  async unloadSounds() {
    if (this.clickSound) {
      await this.clickSound.unloadAsync();
      this.clickSound = null;
      this.isLoaded = false;
    }
  }
}

export const soundManager = new SoundManager();