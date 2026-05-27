import React, { createContext, useContext, useCallback, useEffect, ReactNode } from 'react';
import { SuperellipseState } from '../hooks/useSuperellipse';
import { Layer, Asset, Project } from '../types';
import { useUndoRedo } from '../hooks/useUndoRedo';

interface EditorContextType {
  // Superellipse state
  state: SuperellipseState;
  updateState: (updates: Partial<SuperellipseState>) => void;
  updateGradientStop: (index: number, updates: any) => void;
  resetState: () => void;
  randomizeGlow: () => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Layers
  layers: Layer[];
  selectedLayerId: string | null;
  selectLayer: (id: string | null) => void;
  addLayer: (type: any, name?: string) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  duplicateLayer: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  toggleSolo: (id: string) => void;
  reorderLayer: (fromIndex: number, toIndex: number) => void;
  groupLayers: (ids: string[]) => void;
  ungroupLayer: (id: string) => void;
  toggleGroupExpanded: (id: string) => void;
  addEffect: (layerId: string, effect: any) => void;
  removeEffect: (layerId: string, effectId: string) => void;

  // Assets
  assets: Asset[];
  assetsLoading: boolean;
  assetsError: string | null;
  uploadAsset: (file: File) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;
  loadGoogleFont: (family: string) => Promise<any>;
  getStorageUsage: () => number;

  // Projects
  currentProject: Project | null;
  projects: Project[];
  projectLoading: boolean;
  projectError: string | null;
  createProject: (project: Partial<Project>) => void;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  exportProject: (format: 'json') => Promise<Blob>;
  importProject: (file: File) => Promise<void>;
  updateProjectMetadata: (updates: Partial<Project>) => void;
  updateCanvasSettings: (settings: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialState: SuperellipseState;
  onStateChange?: (state: SuperellipseState) => void;
}

export function EditorProvider({
  children,
  initialState,
  onStateChange,
}: EditorProviderProps) {
  // These would normally be filled with actual hook implementations
  // For now, we're creating the context structure for integration
  const contextValue: EditorContextType = {
    state: initialState,
    updateState: () => {},
    updateGradientStop: () => {},
    resetState: () => {},
    randomizeGlow: () => {},
    undo: () => {},
    redo: () => {},
    canUndo: false,
    canRedo: false,
    layers: [],
    selectedLayerId: null,
    selectLayer: () => {},
    addLayer: () => {},
    removeLayer: () => {},
    updateLayer: () => {},
    duplicateLayer: () => {},
    toggleVisibility: () => {},
    toggleLock: () => {},
    toggleSolo: () => {},
    reorderLayer: () => {},
    groupLayers: () => {},
    ungroupLayer: () => {},
    toggleGroupExpanded: () => {},
    addEffect: () => {},
    removeEffect: () => {},
    assets: [],
    assetsLoading: false,
    assetsError: null,
    uploadAsset: async () => ({}) as any,
    deleteAsset: async () => {},
    loadGoogleFont: async () => ({}),
    getStorageUsage: () => 0,
    currentProject: null,
    projects: [],
    projectLoading: false,
    projectError: null,
    createProject: () => {},
    saveProject: async () => {},
    loadProject: async () => {},
    deleteProject: async () => {},
    exportProject: async () => new Blob(),
    importProject: async () => {},
    updateProjectMetadata: () => {},
    updateCanvasSettings: () => {},
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
