"use client";
import { Action, Blink, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useEffect, useState } from "react";
import '@dialectlabs/blinks/index.css';

function BlinkCard() {
    const [websiteText, setWebsiteText] = useState<string>("");
    const [action, setAction] = useState<Action | undefined>();
    const { isRegistryLoaded } = useActionsRegistryInterval();

    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        }
    }, []);

    return (
        <div style={{
            maxWidth: '450px',
            margin: '0 auto',
            padding: "10px",
            width: '100%'
        }}>
            {isRegistryLoaded && action && (
                <>
                    <Blink stylePreset='custom' action={action} websiteText={websiteText} />
                </>
            )}
        </div>
    );
}

export default BlinkCard;