"use client";
import { Action, Blink, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useEffect, useRef, useState } from "react";
import '@dialectlabs/blinks/index.css';
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

function BlinkCard() {
    const [websiteText, setWebsiteText] = useState<string>("");
    const [action, setAction] = useState<Action | undefined>();
    const { isRegistryLoaded } = useActionsRegistryInterval();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasClientRef = useRef<CanvasClient | undefined>();
    const [canvasClient, setCanvasClient] = useState<CanvasClient | null>(null);

    const isIframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };

    useEffect(() => {
        if (isIframe() || typeof window !== 'undefined') {
            if (isIframe()) {
                const client = new CanvasClient();
                canvasClientRef.current = client;
                setCanvasClient(client);
            }
            const resizeObserver = new ResizeObserver(() => {
                canvasClientRef?.current?.resize();
            });
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }
            const urlParams = new URLSearchParams(window.location.search);
            const actionQuery = urlParams.get('action');
            if (actionQuery) {
                const fetchData = async () => {
                    try {
                        const actionUrl = new URL(actionQuery);
                        setWebsiteText(actionUrl.hostname);
                        const action = await Action.fetch(actionQuery);
                        setAction(action);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
                fetchData();
            }
            return () => {
                if (containerRef.current) {
                    resizeObserver.unobserve(containerRef.current);
                }
            };
        }
    }, []);

    return (
        <div ref={containerRef}
            style={{
                maxWidth: '450px',
                margin: '0 auto',
                padding: "10px",
                width: '100%'
            }}
            className="text-center"
        >
            {isRegistryLoaded && action && (
                <>
                    <Blink stylePreset='custom' action={action} websiteText={websiteText} />
                    <p className="text-white font-mono">
                        {canvasClient ? 'Canvas client initialized' : 'Blink...!'}
                    </p>
                </>
            )}
        </div>
    );
}

export default BlinkCard;