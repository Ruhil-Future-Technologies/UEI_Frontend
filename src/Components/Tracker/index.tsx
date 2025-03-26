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

  const [, setLastUpdateTime] = useState<number>(Math.floor(Date.now() / 1000));
  const lastUpdateTimeRef = useRef<number>(Math.floor(Date.now() / 1000));

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
      localStorage.setItem(
        lastSyncKey,
        Math.floor(Date.now() / 1000).toString(),
      );
    }

    setLastUpdateTime(Math.floor(Date.now() / 1000));
  }, [userId]);

  useEffect(() => {
    if (!userId || !loginTime) return;

    const updateLocalStorage = () => {
      if (isActive) {
        const currentTime = Math.floor(Date.now() / 1000);

        const elapsedSeconds = Math.max(
          currentTime - lastUpdateTimeRef.current,
          1,
        );

        const storedData: SessionData = JSON.parse(
          localStorage.getItem(storageKey) || '{}',
        );

        const updatedData: SessionData = {
          loginTime: storedData.loginTime || loginTime,
          duration: (storedData.duration || 0) + elapsedSeconds,
        };

        console.log({ 'update localStorage': updatedData });
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
            ...(sessionData.logoutTime && {
              logout_time: sessionData.logoutTime,
            }),
            duration: sessionData.duration,
          };
          console.log({ saving: payload });

          await postDataJson(`${'/session/add'}`, payload);

          const resetData: SessionData = {
            loginTime: sessionData.loginTime,
            duration: 0,
          };
          localStorage.setItem(storageKey, JSON.stringify(resetData));
          localStorage.setItem(
            lastSyncKey,
            Math.floor(Date.now() / 1000).toString(),
          );

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
        setLastUpdateTime(Math.floor(Date.now() / 1000));
      }
    };

    const resetInactivityTimer = () => {
      if (!isActive) {
        setIsActive(true);
        setLastUpdateTime(Math.floor(Date.now() / 1000));
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
        const logoutTimestamp = Math.floor(
          new Date(logoutTime).getTime() / 1000,
        );
        finalData.duration =
          logoutTimestamp - lastUpdateTimeRef.current + finalData.duration;
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
