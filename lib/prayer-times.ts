import { DailyPrayerTimes, PrayerName, PrayerTime } from '@/types/database';
import { format, parseISO } from 'date-fns';

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      Sunrise: string;
      Sunset: string;
    };
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

export const prayerTimesService = {
  async fetchPrayerTimes(
    latitude: number,
    longitude: number,
    method: string = 'MWL',
    date?: Date
  ): Promise<DailyPrayerTimes | null> {
    try {
      const targetDate = date || new Date();
      const timestamp = Math.floor(targetDate.getTime() / 1000);

      const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

      const response = await fetch(url);
      const data: PrayerTimesResponse = await response.json();

      if (data.code !== 200) {
        throw new Error('Failed to fetch prayer times');
      }

      return {
        date: format(targetDate, 'yyyy-MM-dd'),
        fajr: this.cleanTime(data.data.timings.Fajr),
        dhuhr: this.cleanTime(data.data.timings.Dhuhr),
        asr: this.cleanTime(data.data.timings.Asr),
        maghrib: this.cleanTime(data.data.timings.Maghrib),
        isha: this.cleanTime(data.data.timings.Isha),
      };
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      return null;
    }
  },

  cleanTime(time: string): string {
    return time.split(' ')[0];
  },

  getPrayerTimesArray(prayerTimes: DailyPrayerTimes): PrayerTime[] {
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        name: 'Fajr',
        time: prayerTimes.fajr,
        timestamp: new Date(`${today}T${prayerTimes.fajr}`).getTime(),
      },
      {
        name: 'Dhuhr',
        time: prayerTimes.dhuhr,
        timestamp: new Date(`${today}T${prayerTimes.dhuhr}`).getTime(),
      },
      {
        name: 'Asr',
        time: prayerTimes.asr,
        timestamp: new Date(`${today}T${prayerTimes.asr}`).getTime(),
      },
      {
        name: 'Maghrib',
        time: prayerTimes.maghrib,
        timestamp: new Date(`${today}T${prayerTimes.maghrib}`).getTime(),
      },
      {
        name: 'Isha',
        time: prayerTimes.isha,
        timestamp: new Date(`${today}T${prayerTimes.isha}`).getTime(),
      },
    ];
  },

  getNextPrayer(prayerTimes: DailyPrayerTimes): PrayerTime | null {
    const prayers = this.getPrayerTimesArray(prayerTimes);
    const now = Date.now();

    for (const prayer of prayers) {
      if (prayer.timestamp > now) {
        return prayer;
      }
    }

    return null;
  },

  getCurrentPrayer(prayerTimes: DailyPrayerTimes): PrayerTime | null {
    const prayers = this.getPrayerTimesArray(prayerTimes);
    const now = Date.now();

    let currentPrayer: PrayerTime | null = null;

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].timestamp <= now) {
        currentPrayer = prayers[i];
      } else {
        break;
      }
    }

    return currentPrayer;
  },

  getTimeUntilPrayer(prayerTime: PrayerTime): {
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = Date.now();
    const diff = prayerTime.timestamp - now;

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  },

  formatTimeUntil(timeUntil: {
    hours: number;
    minutes: number;
    seconds: number;
  }): string {
    const { hours, minutes, seconds } = timeUntil;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  },
};

export const CALCULATION_METHODS = [
  { value: 'MWL', label: 'Muslim World League' },
  { value: 'ISNA', label: 'Islamic Society of North America' },
  { value: 'Egypt', label: 'Egyptian General Authority' },
  { value: 'Makkah', label: 'Umm Al-Qura University, Makkah' },
  { value: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { value: 'Tehran', label: 'Institute of Geophysics, University of Tehran' },
  { value: 'Jafari', label: 'Shia Ithna-Ashari, Leva Institute, Qum' },
];
