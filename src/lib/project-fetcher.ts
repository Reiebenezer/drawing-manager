'use server';

import fs from 'fs/promises';
import fsSync from 'fs';

const defaultProjectDirectory = `${process.cwd()}/projects`;
const fetchedProjects = new Map<string, object>();

export async function fetchProjectList() {
  try {
    await fs.mkdir(defaultProjectDirectory);
    console.log(`Directory ${defaultProjectDirectory} created.`);
  } catch (error) {
    if ((error as any).code !== "EEXIST") {
      console.error('Error creating folder. Error: ', error);
    }

    else 
      console.log(`Folder ${defaultProjectDirectory} already exists. Skipping...`);
  }

  const list = await fs.readdir(defaultProjectDirectory);

  return list
    .filter((file) => file.endsWith('.excalidraw'))
    .map((filepath) => ({
      name: filepath.replace(/(.+?)\.excalidraw/, '$1'),
      time: fsSync.statSync(`${defaultProjectDirectory}/${filepath}`).mtime,
    }));
}

export async function fetchExcalidrawData(projectName: string) {
  if (fetchedProjects.has(projectName)) {
    // console.log('returning existing project...');
    return fetchedProjects.get(projectName)!
  }

  const file = await fs.readFile(`${defaultProjectDirectory}/${projectName}.excalidraw`, 'utf8');
  const data = JSON.parse(file);

  fetchedProjects.set(projectName, data);
  return data;
}

export async function updateExcalidrawFileData(projectName: string, data: object) {
  const newData = { ...(fetchedProjects.get(projectName) ?? {}), ...data };
  fetchedProjects.set(projectName, data);
  
  // console.log(`updating ${projectName}...`);
  await fs.writeFile(`${defaultProjectDirectory}/${projectName}.excalidraw`, JSON.stringify(newData), 'utf8');
}

export async function createExcalidrawFile(projectName: string) {
  return await updateExcalidrawFileData(projectName, {});
}

export async function removeExcalidrawFile(projectName: string) {
  fetchedProjects.delete(projectName);
  await fs.unlink(`${defaultProjectDirectory}/${projectName}.excalidraw`);
}