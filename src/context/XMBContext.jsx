/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { categories } from '../manifest';

const XMBContext = createContext(null);

const initialState = {
  currentCategory: 0,
  selectedIndices: categories.map(cat => cat.defaultIndex ?? 0),
  subMenuOpen: false,
  subMenuIndex: 0,
  contextMenuOpen: false,
  contextMenuIndex: 0,
  activeItem: null,
  showMedia: null,
  showLoading: false,
  loadingItem: null,
  showDocumentViewer: false,
  showGalleryViewer: false,
  showDownloadPanel: false,
  showSidePanel: false,
  sidePanelMode: null,
  sidePanelActionIndex: 0,
  showQuitDialog: false,
  quitDialogIndex: 0,
  isSwitchingCategory: false,
};

function getCurrentItem(state) {
  return categories[state.currentCategory]?.items[state.selectedIndices[state.currentCategory]];
}

function getContextOptions(item) {
  if (!item) return [];
  const options = [];
  const action = item.action;
  if (action?.type === 'media') {
    options.push({ id: 'play', label: 'Play' });
    options.push({ id: 'new-tab', label: 'Open in New Tab' });
  }
  return options;
}

function activateItem(state, item) {
  if (item.type === 'application') {
    return { ...state, showLoading: true, loadingItem: item, showSidePanel: false, sidePanelMode: null };
  }
  if (item.type === 'document') {
    return { ...state, showDocumentViewer: true, activeItem: item, showSidePanel: false, sidePanelMode: null };
  }
  if (item.type === 'gallery') {
    return { ...state, showGalleryViewer: true, activeItem: item, showSidePanel: false, sidePanelMode: null };
  }
  if (item.type === 'download') {
    return { ...state, showDownloadPanel: true, activeItem: item, showSidePanel: false, sidePanelMode: null };
  }
  return { ...state, showSidePanel: true, sidePanelMode: 'info', activeItem: item };
}

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE_CATEGORY': {
      const next = state.currentCategory + action.direction;
      if (next < 0 || next >= categories.length) return state;
      return {
        ...state,
        currentCategory: next,
        subMenuOpen: false,
        contextMenuOpen: false,
        isSwitchingCategory: true,
      };
    }

    case 'NAVIGATE_TO_CATEGORY': {
      if (action.index === state.currentCategory) return state;
      if (action.index < 0 || action.index >= categories.length) return state;
      return {
        ...state,
        currentCategory: action.index,
        subMenuOpen: false,
        contextMenuOpen: false,
        isSwitchingCategory: true,
      };
    }

    case 'NAVIGATE_ITEM': {
      if (state.subMenuOpen) {
        const item = getCurrentItem(state);
        const subItems = item?.subItems || [];
        const next = state.subMenuIndex + action.direction;
        if (next < 0 || next >= subItems.length) return state;
        return { ...state, subMenuIndex: next };
      }
      if (state.contextMenuOpen) {
        const item = getCurrentItem(state);
        const options = getContextOptions(item);
        const next = state.contextMenuIndex + action.direction;
        if (next < 0 || next >= options.length) return state;
        return { ...state, contextMenuIndex: next };
      }
      const next = state.selectedIndices[state.currentCategory] + action.direction;
      const len = categories[state.currentCategory].items.length;
      if (next < 0 || next >= len) return state;
      const updated = [...state.selectedIndices];
      updated[state.currentCategory] = next;
      return { ...state, selectedIndices: updated, subMenuOpen: false, isSwitchingCategory: false };
    }

    case 'ACTIVATE': {
      if (state.subMenuOpen) {
        const item = getCurrentItem(state);
        const sub = item?.subItems?.[state.subMenuIndex];
        if (!sub) return state;
        return activateItem(state, sub);
      }
      const item = getCurrentItem(state);
      if (!item) return state;
      if (item.subItems?.length) {
        return { ...state, subMenuOpen: true, subMenuIndex: 0 };
      }
      return activateItem(state, item);
    }

    case 'BACK': {
      if (state.showQuitDialog) return state;
      if (state.showMedia) return { ...state, showQuitDialog: true };
      if (state.showDocumentViewer) return { ...state, showDocumentViewer: false, activeItem: null };
      if (state.showGalleryViewer) return { ...state, showGalleryViewer: false, activeItem: null };
      if (state.showDownloadPanel) return { ...state, showDownloadPanel: false, activeItem: null };
      if (state.showSidePanel) return { ...state, showSidePanel: false, sidePanelMode: null, activeItem: null };
      if (state.contextMenuOpen) return { ...state, contextMenuOpen: false };
      if (state.subMenuOpen) return { ...state, subMenuOpen: false };
      return state;
    }

    case 'OPEN_SIDE_PANEL': {
      return {
        ...state,
        showSidePanel: true,
        sidePanelMode: action.mode,
        sidePanelActionIndex: 0,
        activeItem: action.item || getCurrentItem(state),
        contextMenuOpen: false,
      };
    }

    case 'NAVIGATE_SIDE_PANEL': {
      const item = state.activeItem;
      const options = getContextOptions(item);
      const count = state.sidePanelMode === 'actions' ? options.length : item?.action?.type === 'media' ? 2 : 0;
      if (count === 0) return state;
      const next = state.sidePanelActionIndex + action.direction;
      if (next < 0 || next >= count) return state;
      return { ...state, sidePanelActionIndex: next };
    }

    case 'EXECUTE_SIDE_PANEL_ACTION': {
      const item = state.activeItem;
      if (!item) return state;
      if (state.sidePanelMode === 'actions') {
        const options = getContextOptions(item);
        const selected = options[state.sidePanelActionIndex];
        if (!selected) return state;
        if (selected.id === 'play') {
          return { ...state, showSidePanel: false, sidePanelMode: null, showLoading: true, loadingItem: item, activeItem: null };
        }
        if (selected.id === 'new-tab') {
          return { ...state, showSidePanel: false, sidePanelMode: null, activeItem: null };
        }
        if (selected.id === 'info') {
          return { ...state, sidePanelMode: 'info', sidePanelActionIndex: 0 };
        }
      } else {
        const isMedia = item?.action?.type === 'media';
        const actionIdx = state.sidePanelActionIndex;
        if (actionIdx === 0 && isMedia) {
          return { ...state, showSidePanel: false, sidePanelMode: null, showLoading: true, loadingItem: item, activeItem: null };
        }
        if (actionIdx === 1 && isMedia) {
          return { ...state, showSidePanel: false, sidePanelMode: null, activeItem: null };
        }
      }
      return { ...state, showSidePanel: false, sidePanelMode: null, activeItem: null };
    }

    case 'NAVIGATE_QUIT_DIALOG': {
      const next = state.quitDialogIndex + action.direction;
      if (next < 0 || next > 1) return state;
      return { ...state, quitDialogIndex: next };
    }

    case 'EXECUTE_QUIT_DIALOG': {
      if (state.quitDialogIndex === 0) {
        return {
          ...state,
          showQuitDialog: false,
          showMedia: null,
          showSidePanel: false,
          sidePanelMode: null,
          activeItem: null,
        };
      }
      return { ...state, showQuitDialog: false };
    }

    case 'CLOSE_SIDE_PANEL': {
      return { ...state, showSidePanel: false, sidePanelMode: null, activeItem: null };
    }

    case 'OPEN_MEDIA': {
      return { ...state, showMedia: action.item, showSidePanel: false, sidePanelMode: null };
    }

    case 'CLOSE_MEDIA': {
      return { ...state, showMedia: null, activeItem: null, showSidePanel: false, sidePanelMode: null };
    }

    case 'SHOW_QUIT_DIALOG': {
      return { ...state, showQuitDialog: true };
    }

    case 'HIDE_QUIT_DIALOG': {
      return { ...state, showQuitDialog: false };
    }

    case 'QUIT_MEDIA': {
      return {
        ...state,
        showQuitDialog: false,
        showMedia: null,
        showSidePanel: false,
        sidePanelMode: null,
        activeItem: null,
      };
    }

    case 'LOADING_COMPLETE': {
      return {
        ...state,
        showLoading: false,
        showMedia: state.loadingItem,
        loadingItem: null,
      };
    }

    default:
      return state;
  }
}

export function XMBProvider({ children, playSound }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigateCategory = useCallback((direction) => {
    playSound('cursor');
    dispatch({ type: 'NAVIGATE_CATEGORY', direction });
  }, [playSound]);

  const navigateToCategory = useCallback((index) => {
    playSound('cursor');
    dispatch({ type: 'NAVIGATE_TO_CATEGORY', index });
  }, [playSound]);

  const navigateItem = useCallback((direction) => {
    playSound('cursor');
    dispatch({ type: 'NAVIGATE_ITEM', direction });
  }, [playSound]);

  const activate = useCallback(() => {
    playSound('confirm');
    dispatch({ type: 'ACTIVATE' });
  }, [playSound]);

  const back = useCallback(() => {
    // Only play cancel sound when showing quit dialog from media
    if (state.showMedia) {
      playSound('cancel');
    }
    dispatch({ type: 'BACK' });
  }, [playSound, state.showMedia]);

  const openSidePanel = useCallback((mode, item) => {
    playSound('confirm');
    dispatch({ type: 'OPEN_SIDE_PANEL', mode, item });
  }, [playSound]);

  const closeSidePanel = useCallback(() => {
    dispatch({ type: 'CLOSE_SIDE_PANEL' });
  }, []);

  const openMedia = useCallback((item) => {
    playSound('start');
    dispatch({ type: 'OPEN_MEDIA', item });
  }, [playSound]);

  const closeMedia = useCallback(() => {
    dispatch({ type: 'CLOSE_MEDIA' });
  }, []);

  const showQuitDialog = useCallback(() => {
    dispatch({ type: 'SHOW_QUIT_DIALOG' });
  }, []);

  const hideQuitDialog = useCallback(() => {
    dispatch({ type: 'HIDE_QUIT_DIALOG' });
  }, []);

  const quitMedia = useCallback(() => {
    dispatch({ type: 'QUIT_MEDIA' });
  }, []);

  const navigateSidePanel = useCallback((direction) => {
    playSound('cursor');
    dispatch({ type: 'NAVIGATE_SIDE_PANEL', direction });
  }, [playSound]);

  const executeSidePanelAction = useCallback(() => {
    playSound('confirm');
    dispatch({ type: 'EXECUTE_SIDE_PANEL_ACTION' });
  }, [playSound]);

  const navigateQuitDialog = useCallback((direction) => {
    playSound('cursor');
    dispatch({ type: 'NAVIGATE_QUIT_DIALOG', direction });
  }, [playSound]);

  const executeQuitDialog = useCallback(() => {
    playSound('confirm');
    dispatch({ type: 'EXECUTE_QUIT_DIALOG' });
  }, [playSound]);

  const loadingComplete = useCallback(() => {
    dispatch({ type: 'LOADING_COMPLETE' });
  }, []);

  const value = useMemo(() => ({
    state,
    navigateCategory,
    navigateToCategory,
    navigateItem,
    activate,
    back,
    openSidePanel,
    closeSidePanel,
    openMedia,
    closeMedia,
    showQuitDialog,
    hideQuitDialog,
    quitMedia,
    navigateSidePanel,
    executeSidePanelAction,
    navigateQuitDialog,
    executeQuitDialog,
    loadingComplete,
    getCurrentItem,
    getContextOptions,
  }), [state, navigateCategory, navigateToCategory, navigateItem, activate, back, openSidePanel, closeSidePanel, openMedia, closeMedia, showQuitDialog, hideQuitDialog, quitMedia, navigateSidePanel, executeSidePanelAction, navigateQuitDialog, executeQuitDialog, loadingComplete]);

  return <XMBContext.Provider value={value}>{children}</XMBContext.Provider>;
}

export function useXMB() {
  const ctx = useContext(XMBContext);
  if (!ctx) throw new Error('useXMB must be used within XMBProvider');
  return ctx;
}
