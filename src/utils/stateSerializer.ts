import { SuperellipseState } from '../hooks/useSuperellipse';
import { Layer, Project } from '../types';

export interface EditorStateSnapshot {
  version: 1;
  timestamp: number;
  project?: Project;
  state: SuperellipseState;
  layers: Layer[];
}

export function serializeState(
  state: SuperellipseState,
  layers: Layer[],
  project?: Project
): EditorStateSnapshot {
  return {
    version: 1,
    timestamp: Date.now(),
    project,
    state,
    layers,
  };
}

export function deserializeState(data: unknown): EditorStateSnapshot | null {
  if (!data || typeof data !== 'object') return null;

  const snapshot = data as any;

  if (snapshot.version !== 1) {
    console.warn('Unsupported state version:', snapshot.version);
    return null;
  }

  return snapshot as EditorStateSnapshot;
}

export function stateToJSON(snapshot: EditorStateSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function stateFromJSON(json: string): EditorStateSnapshot | null {
  try {
    const data = JSON.parse(json);
    return deserializeState(data);
  } catch (e) {
    console.error('Failed to parse state JSON:', e);
    return null;
  }
}

export async function exportStateAsFile(snapshot: EditorStateSnapshot): Promise<Blob> {
  const json = stateToJSON(snapshot);
  return new Blob([json], { type: 'application/json' });
}

export async function importStateFromFile(file: File): Promise<EditorStateSnapshot | null> {
  try {
    const text = await file.text();
    return stateFromJSON(text);
  } catch (e) {
    console.error('Failed to read state file:', e);
    return null;
  }
}

export function encodeStateToURL(snapshot: EditorStateSnapshot): string {
  const json = JSON.stringify(snapshot);
  const compressed = btoa(json);
  return `?state=${encodeURIComponent(compressed)}`;
}

export function decodeStateFromURL(params: URLSearchParams): EditorStateSnapshot | null {
  const encoded = params.get('state');
  if (!encoded) return null;

  try {
    const json = atob(decodeURIComponent(encoded));
    return stateFromJSON(json);
  } catch (e) {
    console.error('Failed to decode state from URL:', e);
    return null;
  }
}
