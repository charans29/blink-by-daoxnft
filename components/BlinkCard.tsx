"use client"
import React, { useEffect, useRef, useState } from "react";
import '@dialectlabs/blinks/index.css';
import { Action, Blink } from "@dialectlabs/blinks";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";

function BlinkCard() {
  const [websiteText, setWebsiteText] = useState<string>("");
  const [action, setAction] = useState<Action | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvasClient = useRef<CanvasClient | null>(null);

  useEffect(() => {
    if (window.self !== window.top) {
      canvasClient.current = new CanvasClient();
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
     
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
          const fetchedAction = await Action.fetch(actionQuery);
          console.log("A__X__Ns: ", fetchedAction)
          setAction(fetchedAction);
        } catch (fetchError) {
          console.error('Error fetching data:', fetchError);
          setError('Failed to load Blink content.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
        <div
            ref={containerRef}
            style={{
                maxWidth: '450px',
                margin: '0 auto',
                padding: "10px",
                width: '100%',
            }}
            className="text-center w-10/12 flex flex-row space-y-4 justify-center items-center"
        >
            {action && (
                <>
                <Blink stylePreset="custom" action={action} websiteText={websiteText} />
                <p className="text-white font-mono">
                    {canvasClient.current ? 'Canvas client initialized' : ''}
                </p>
                </>
            )}
        </div>
  );
}

export default BlinkCard;