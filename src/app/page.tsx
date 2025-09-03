'use client';
import { createExcalidrawFile, fetchProjectList, removeExcalidrawFile } from "@/lib/project-fetcher";
import dynamic from "next/dynamic";
import { FocusEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const ExcalidrawWrapper = useMemo(() => dynamic(
    async () => (await import('../lib/ExcalidrawWrapper')).default,
    {
      ssr: false
    }
  ), []);

  // ------------------------------------------------------------------------------------
  // useStates and useCallbacks
  // ------------------------------------------------------------------------------------
  const [projectList, setProjectList] = useState<{
    name: string;
    time: Date;
  }[]>();
  const [showProjectList, setShowProjectList] = useState(false);
  const [currentProject, setCurrentProject] = useState<string>();

  const createProject = useCallback(async () => {
    const projectName = prompt("Enter the project name below: ");

    if (!projectName) return;

    await createExcalidrawFile(projectName);
    setProjectList(prev => [...prev ?? [], { name: projectName, time: new Date() }]);
  }, [])

  // ------------------------------------------------------------------------------------
  // useEffects
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    if (!projectList) return;
    console.log('switching back')
    setCurrentProject(projectList.at(0)?.name);
  }, [projectList]);

  // ------------------------------------------------------------------------------------
  // OnMount
  // ------------------------------------------------------------------------------------
  const closeProjectListOnDifferentFocus = (e: MouseEvent) => {
    // console.log((e.target as HTMLElement).closest('#project-list'));

    if (!(e.target as HTMLElement).closest('#project-list'))
      setShowProjectList(false);
  }

  useEffect(() => {
    fetchProjectList().then(setProjectList);
    window.addEventListener('click', closeProjectListOnDifferentFocus);

    return () => {
      window.removeEventListener('click', closeProjectListOnDifferentFocus);
    }
  }, []);

  if (!projectList) {
    return null;
  }

  return projectList.length > 0 ? (
    currentProject && (
      <>
        <div className="fixed inset-0">
          <ExcalidrawWrapper currentProject={currentProject} />
        </div>
        <div className="fixed left-0 inset-y-0 ml-16 mt-4 mb-16 flex flex-col gap-2" id="project-list">
          <button onClick={() => setShowProjectList(!showProjectList)} className="rounded-md bg-[#232329] p-2 grid place-content-center size-9 cursor-pointer">P</button>
          {showProjectList &&
            <aside className="flex-grow rounded-md min-w-xs p-4 bg-[#232329]">
              <h2 className="font-bold text-xl mb-4">My Projects</h2>
              <ul className="flex flex-col gap-2">
                {projectList && projectList.map(({ name, time }) => (
                  <div className={`p-3 rounded-lg ${currentProject === name && 'bg-slate-300 text-gray-800'} bg-gray-900 flex gap-4 items-center`} key={name}
                    title={`Project ${name} ${currentProject === name ? '(is current working project)' : ''}`}
                  >
                    <button className="text-left cursor-pointer" onClick={() => { setCurrentProject(name); setShowProjectList(false) }}>
                      <h3 className="font-bold text-md">{name}</h3>
                      <p className="text-xs text-gray-500">
                        Last modified on {time.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </button>
                    <button
                      className="bg-red-700 cursor-pointer px-2 py-1 ml-auto text-sm rounded-sm font-bold text-gray-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this project?')) {
                          removeExcalidrawFile(name);
                          setProjectList(prev => prev?.filter(p => p.name !== name));
                        }
                      }}
                    >Delete</button>
                  </div>
                ))}
                <button className="p-3 rounded-md bg-gray-900 text-left cursor-pointer" onClick={createProject}>
                  <p className="text-gray-500">Add new project</p>
                </button>

              </ul>
            </aside>
          }
        </div>
      </>
    )
  ) : (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-black">Drawing Manager</h1>
      <p className="mt-2">Powered by Excalidraw</p>

      <button className="mt-12 rounded-md bg-[#232329] px-4 py-2 cursor-pointer" onClick={createProject}>Create New Project</button>

      <footer className="absolute bottom-0 inset-x-0 p-8 flex justify-between text-gray-400/50 text-sm">
        <p>A small project, made with ❤️ by Rei Ebenezer. </p>
        <p>Build your own Excalidraw clone: <a href="https://docs.excalidraw.com/">https://docs.excalidraw.com/</a></p>
      </footer>
    </div>
  );
}