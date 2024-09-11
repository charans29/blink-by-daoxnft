"use client"
import React, { useEffect, useRef, useState } from "react";
import {
  Action,
  ActionContainer,
  useActionsRegistryInterval
} from "@dialectlabs/blinks";
import '@dialectlabs/blinks/index.css';

import { CanvasClient } from "@dscvr-one/canvas-client-sdk";
import { CanvasAdapter, isIframe } from "@/adapter/canvas-adapter";

export default function Blink() {
  const [action, setAction] = useState<Action | null>(null);
  const [iframe, setIsInIframe] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteText, setWebsiteText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasClientRef = useRef<CanvasClient | undefined>();
  const { isRegistryLoaded } = useActionsRegistryInterval();
  
  useEffect(() => {
    console.log("i____FRAME:", isIframe())
    if(isIframe()) {
      canvasClientRef.current = new CanvasClient();
    };

    setIsInIframe(isIframe());
    const adapter = iframe ? new CanvasAdapter() : undefined;

    const fetchAction = async () => {
      const url = new URL(window.location.href);
      
      const actionParam = url.searchParams.get('action') ?? "https://da0-x-nft.vercel.app/api/join-dao-action?nft_id=20&mbrs=4&frcn=4";
      
      if (actionParam) {
        try {
          const actionUrl = new URL(actionParam);
          
          setWebsiteUrl(actionUrl.toString());
          setWebsiteText(actionUrl.host);

          const action = await Action.fetch(
            actionParam,
            adapter
          );
          setAction(action);
        } catch (error) {
          console.error("Invalid action URL:", error);
        }
      } else {
        console.error("No action parameter provided in URL");
      }
    };
    fetchAction();

    const resizeObserver = new ResizeObserver(() => {
      canvasClientRef?.current?.resize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const exampleCallbacks = {
    onActionMount: (action: Action, originalUrl: string, actionState: "trusted" | "malicious" | "unknown") => {
      console.log("Action mounted:", action, originalUrl, actionState);
    },
  };

  const exampleSecurityLevel = "only-trusted";

  const containerStyle = {
    maxWidth: '450px',
    margin: '0 auto',
    width: '100%'
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {isRegistryLoaded && action && (
        <ActionContainer
          action={action}
          websiteUrl={websiteUrl}
          websiteText={websiteText}
          callbacks={exampleCallbacks}
          securityLevel={exampleSecurityLevel}
          stylePreset="custom"
        />
      )}
    </div>
  );
}
