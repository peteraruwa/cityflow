import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../shared/config/firebase';
import { getPictureOfTheDay } from './data/gallery';

const DEFAULT_PICTURE = getPictureOfTheDay();

function normalizeRemotePicture(data) {
  if (!data?.activePicture?.imageUrl) return null;
  const picture = data.activePicture;
  return {
    picture: {
      id: picture.id || 'admin-picture-of-day',
      imageUrl: picture.imageUrl,
      title: picture.title || 'Picture of the Day',
      date: picture.date || 'Redemption City',
      category: picture.category || 'Featured',
      categoryColor: picture.categoryColor || '#C48D38',
      caption: picture.caption || '',
      story: picture.story || picture.caption || '',
      uploadedBy: picture.uploadedBy || 'CityFlow Admin',
    },
    index: -1,
    source: 'admin',
  };
}

export default function usePictureOfTheDay() {
  const [state, setState] = useState({ ...DEFAULT_PICTURE, source: 'local' });

  useEffect(() => {
    let mounted = true;

    async function loadOverride() {
      const fallback = { ...getPictureOfTheDay(), source: 'local' };
      try {
        const snap = await getDoc(doc(db, 'appConfig', 'pictureOfTheDay'));
        const remote = snap.exists() ? normalizeRemotePicture(snap.data()) : null;
        if (mounted) setState(remote || fallback);
      } catch (err) {
        if (mounted) setState(fallback);
      }
    }

    loadOverride();
    const interval = setInterval(loadOverride, 60 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return state;
}
