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
  const [isSyncing, setIsSyncing] = useState(false);
  const lastUpdateTimeRef = useRef<number>(Math.floor(Date.now() / 1000));
  const [, setLastUpdateTime] = useState<number>(Math.floor(Date.now() / 1000));

  const storageKey = `user_session_data`;
  const lastSyncKey = `user_last_sync`;

  function formatDateTime(date: Date): string {
    return date.toISOString();
  }

  function updateLocalStorage() {
    if (!isActive || !loginTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedSeconds = Math.max(currentTime - lastUpdateTimeRef.current, 1);

    const storedData: SessionData = JSON.parse(
      localStorage.getItem(storageKey) || '{}',
    );

    const updatedData: SessionData = {
      loginTime: storedData.loginTime || loginTime,
      duration: (storedData.duration || 0) + elapsedSeconds,
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    lastUpdateTimeRef.current = currentTime;
    setLastUpdateTime(currentTime);
  }

  function syncToServer(by: string) {
    if (!userId || isSyncing) {
      return false;
    }

    const sessionData: SessionData = JSON.parse(
      localStorage.getItem(storageKey) || '{}',
    );

    if (sessionData.duration <= 0) {
      return false;
    }

    setIsSyncing(true);

    const payload = {
      login_time: sessionData.loginTime,
      logout_time: by === 'logout' ? new Date().toISOString() : null,
      duration: sessionData.duration,
    };

    postDataJson(`${'/session/add'}`, payload)
      .then(() => {
        const resetData: SessionData = {
          loginTime: sessionData.loginTime,
          duration: 0,
        };
        if (by === 'logout') {
          localStorage.removeItem(storageKey);
          localStorage.removeItem(lastSyncKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(resetData));
          localStorage.setItem(
            lastSyncKey,
            Math.floor(Date.now() / 1000).toString(),
          );
        }
      })
      .catch((err) => {
        console.error('Error in syncToServer:', err);
      })
      .finally(() => {
        setIsSyncing(false);
      });

    return true;
  }

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
  }, [userId]);

  useEffect(() => {
    const localStorageInterval = setInterval(updateLocalStorage, 60000);
    const serverSyncInterval = setInterval(syncToServer, 600000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateLocalStorage();

        const updatedSessionData: SessionData = JSON.parse(
          localStorage.getItem(storageKey) || '{}',
        );

        if (updatedSessionData.duration > 60) {
          setIsActive(false);
          syncToServer('visibilitychange');
        }
      } else {
        setIsActive(true);
      }
    };

    const resetInactivityTimer = () => {
      if (!isActive) {
        setIsActive(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', () => {
      updateLocalStorage();
      syncToServer('beforeunload');
    });

    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      const sessionData: SessionData = JSON.parse(
        localStorage.getItem(storageKey) || '{}',
      );

      const status = document.visibilityState;

      if (status === 'visible' && sessionData.duration < 60) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(lastSyncKey);
      } else if (status === 'visible' && sessionData.duration >= 60) {
        updateLocalStorage();
        syncToServer('logout');
      }

      clearInterval(localStorageInterval);
      clearInterval(serverSyncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isActive, loginTime]);

  return null;
}

export default SessionTracker;
