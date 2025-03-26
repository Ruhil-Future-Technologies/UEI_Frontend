import { useState, useEffect, useRef } from 'react';
import useApi from '../../hooks/useAPI';

interface SessionData {
  loginTime: string;
  logoutTime?: string;
  duration: number;
}

function SessionTracker({ userId }: { userId: string }) {
  const { postDataJson } = useApi();
  const [isActive, setIsActive] = useState(true);
  const [loginTime, setLoginTime] = useState<string>('');

  const [, setLastUpdateTime] = useState<number>(Date.now());
  const lastUpdateTimeRef = useRef<number>(Date.now());

  const storageKey = `user_session_data`;
  const lastSyncKey = `user_last_sync`;

  const formatDateTime = (date: Date): string => {
    return date.toISOString();
  };

  useEffect(() => {
    if (!userId) return;

    const now = new Date();
    const formattedLoginTime = formatDateTime(now);
    setLoginTime(formattedLoginTime);

    if (!localStorage.getItem(storageKey)) {
      const initialData: SessionData = {
        loginTime: formattedLoginTime,
        duration: 0,
      };

      localStorage.setItem(storageKey, JSON.stringify(initialData));
    }

    if (!localStorage.getItem(lastSyncKey)) {
      localStorage.setItem(lastSyncKey, Date.now().toString());
    }

    setLastUpdateTime(Date.now());
  }, [userId]);

  useEffect(() => {
    if (!userId || !loginTime) return;

    const updateLocalStorage = () => {
      if (isActive) {
        const currentTime = Date.now();

        const elapsedSeconds = Math.max(
          (currentTime - lastUpdateTimeRef.current) / 1000,
          10,
        );

        const storedData: SessionData = JSON.parse(
          localStorage.getItem(storageKey) || '{}',
        );

        const updatedData: SessionData = {
          loginTime: storedData.loginTime || loginTime,
          duration: (storedData.duration || 0) + elapsedSeconds,
        };

        localStorage.setItem(storageKey, JSON.stringify(updatedData));

        setLastUpdateTime(currentTime);
        lastUpdateTimeRef.current = currentTime;
      }
    };

    const syncToServer = async () => {
      const sessionData: SessionData = JSON.parse(
        localStorage.getItem(storageKey) || '{}',
      );

      if (sessionData.duration > 0) {
        try {
          const payload = {
            login_time: sessionData.loginTime,
            logout_time: sessionData.logoutTime,
            duration: Math.round(sessionData.duration),
          };

          await postDataJson(`${'/session/add'}`, payload);

          const resetData: SessionData = {
            loginTime: sessionData.loginTime,
            duration: 0,
          };
          localStorage.setItem(storageKey, JSON.stringify(resetData));
          localStorage.setItem(lastSyncKey, Date.now().toString());

          return true;
        } catch (err) {
          console.error('Error preparing sync data:', err);
          return false;
        }
      }
      return false;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsActive(false);
        updateLocalStorage();
        syncToServer();
      } else {
        setIsActive(true);
        setLastUpdateTime(Date.now());
      }
    };

    const resetInactivityTimer = () => {
      if (!isActive) {
        setIsActive(true);
        setLastUpdateTime(Date.now());
      }
    };

    const localStorageInterval = setInterval(updateLocalStorage, 60000);

    const serverSyncInterval = setInterval(syncToServer, 600000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', () => {
      updateLocalStorage();
      syncToServer();
    });

    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      const logoutTime = formatDateTime(new Date());
      const finalData: SessionData = JSON.parse(
        localStorage.getItem(storageKey) || '{}',
      );

      finalData.logoutTime = logoutTime;

      if (finalData.logoutTime) {
        const logoutTimestamp = new Date(logoutTime).getTime();
        finalData.duration = Math.floor(
          (logoutTimestamp - lastUpdateTimeRef.current) / 1000 +
            finalData.duration,
        );
      }
      localStorage.setItem(storageKey, JSON.stringify(finalData));

      const cleanupPromise = syncToServer();

      Promise.resolve(cleanupPromise).then(() => {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(lastSyncKey);
      });

      clearInterval(localStorageInterval);
      clearInterval(serverSyncInterval);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', updateLocalStorage);

      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [loginTime, isActive]);

  return null;
}

export default SessionTracker;
