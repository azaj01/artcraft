import { useEffect, useState } from "react";
import { type UserInfo } from "@storyteller/api";
import { getSession, invalidateSession } from "../../lib/session";

export function useAuthCheck() {
  const [user, setUser] = useState<UserInfo | undefined>(undefined);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkSession = async (force = false) => {
      const response = await getSession(force);
      if (response.success && response.data?.loggedIn && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(undefined);
      }
      setAuthChecked(true);
    };
    checkSession();

    const handleAuthChange = () => {
      invalidateSession();
      checkSession(true);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return { user, authChecked };
}
