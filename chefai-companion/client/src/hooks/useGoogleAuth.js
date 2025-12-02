import { useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = (onSuccess, onError) => {
    const googleButtonRef = useRef(null);
    const isScriptLoaded = useRef(false);

    useEffect(() => {
        // Load Google Identity Services script
        if (!isScriptLoaded.current) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleAuth;
            document.head.appendChild(script);
            isScriptLoaded.current = true;
        } else {
            initializeGoogleAuth();
        }

        function initializeGoogleAuth() {
            if (window.google && GOOGLE_CLIENT_ID) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                });

                // Render the button
                if (googleButtonRef.current) {
                    window.google.accounts.id.renderButton(
                        googleButtonRef.current,
                        {
                            theme: 'outline',
                            size: 'large',
                            text: 'signin_with',
                            width: '100%',
                        }
                    );
                }
            }
        }

        function handleCredentialResponse(response) {
            if (response.credential) {
                onSuccess(response.credential);
            } else {
                onError(new Error('Failed to get Google credential'));
            }
        }

        return () => {
            // Cleanup if needed
        };
    }, [onSuccess, onError]);

    return { googleButtonRef };
};

