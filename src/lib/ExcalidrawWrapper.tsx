'use client'

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { fetchExcalidrawData, updateExcalidrawFileData } from "./project-fetcher";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExcalidrawImperativeAPI, ExcalidrawProps } from "@excalidraw/excalidraw/types";
import { debounce } from "./utils";

const updateData = debounce(updateExcalidrawFileData, 50);

export default function ExcalidrawWrapper({ currentProject }: { currentProject?: string; }) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI>();

  useEffect(() => {
    if (!currentProject) return;
    if (!api?.getAppState().isLoading) return;

    fetchExcalidrawData(currentProject)
      .then(data => {
        if (data.appState?.collaborators)
          delete data.appState.collaborators;

        console.log(data);
        api.resetScene();
        api.updateScene(data);

        api.refresh();
        api.setToast({
          message: `Loaded project ${currentProject}`,
          duration: 3000
        })
      });
      
  }, [currentProject, api])

  useEffect(() => {
    if (!api) return;
    if (!api.getAppState().isLoading) return;

    console.log('Ready: ', api.getAppState().isLoading);

    const destroy = api?.onChange((elements, appState, files) => {
      if (!currentProject) return;

      updateData(currentProject, { elements, appState, files });
    })

    return () => {
      destroy?.();
    }

  }, [api?.getAppState().isLoading])

  const MemoizedExcalidraw = useCallback(() => currentProject
    ? <Excalidraw theme="dark" excalidrawAPI={setApi} />
    : null, [currentProject]
  );

  return (
    <div className="w-full h-full">
      <MemoizedExcalidraw />
    </div>
  );
}