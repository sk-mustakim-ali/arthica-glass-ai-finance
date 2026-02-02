import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export const useCapacitorBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) return;

    let listener: { remove: () => void } | null = null;

    const setupListener = async () => {
      listener = await App.addListener("backButton", ({ canGoBack }) => {
        // If we can go back in browser history, do that
        if (canGoBack && window.history.length > 1) {
          navigate(-1);
        } else {
          // If on the home page and can't go back, minimize the app (Android)
          if (location.pathname === "/") {
            App.minimizeApp();
          } else {
            // Navigate to home instead of closing
            navigate("/");
          }
        }
      });
    };

    setupListener();

    return () => {
      listener?.remove();
    };
  }, [navigate, location.pathname]);
};
