import { useCallback, useRef, useState } from 'react';
import ImportExportClient from '../api/ImportExportClient';
import { useAuthContext } from '../context/AuthContext';
import { ImportResult } from '../types/importExport';

const useImportExport = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>();
  const [file, setFile] = useState<File>();
  const [importError, setImportError] = useState<string>();
  const [exportError, setExportError] = useState<string>();
  const [importResult, setImportResult] = useState<ImportResult>();

  const { authContext } = useAuthContext();

  const doExport = useCallback(() => {
    try {
      setExportError(undefined);

      if (!authContext) {
        throw new Error('Auth context not defined');
      }

      ImportExportClient.doExport(authContext.userId);
    } catch (error) {
      // TODO: Log this and set toast message
      console.error(error);
      setExportError('Failed to export data. Please try again');
    }
  }, [authContext]);

  const doImport = useCallback(async () => {
    try {
      setImportError(undefined);

      if (!authContext) {
        throw new Error('Auth context not defined');
      }

      if (!file) {
        throw new Error('No file selected');
      }

      setImportLoading(true);
      const counts = await ImportExportClient.doImport(
        authContext.userId,
        file
      );
      setImportResult(counts);
      setFileName(undefined);
      setFile(undefined);
      setImportError(undefined);
    } catch (error) {
      // TODO: Log this
      console.error(error);
      setImportError('Failed to import data. Please try again');
    } finally {
      setImportLoading(false);
    }
  }, [authContext, file]);

  const handleUploadClick = () => {
    setImportError('');
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate .json (MIME can be unreliable, so check extension too)
    const isJsonExt = file.name.toLowerCase().endsWith('.json');
    const isJsonMime =
      file.type === 'application/json' || file.type === 'text/json';

    if (!isJsonExt && !isJsonMime) {
      setFileName('');
      setFile(undefined);
      setImportError('Please select a .json file.');
      // Clear the input so the same file can be re-selected
      e.currentTarget.value = '';
      return;
    }

    setImportError('');
    setFileName(file.name);
    setFile(file);
  };

  return {
    importLoading,
    importError,
    exportError,
    fileInputRef,
    fileName,
    importResult,
    setFileName,
    doExport,
    doImport,
    handleUploadClick,
    handleFileChange,
    setImportError,
    setExportError,
  };
};

export default useImportExport;
