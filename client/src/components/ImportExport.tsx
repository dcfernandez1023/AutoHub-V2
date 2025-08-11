import { useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import useImportExport from '../hooks/useImportExport';

const ImportExport: React.FC = () => {
  const {
    importLoading,
    importError,
    exportError,
    fileInputRef,
    fileName,
    importResult,
    doExport,
    doImport,
    handleUploadClick,
    handleFileChange,
  } = useImportExport();

  return (
    <>
      <div>
        <h2>Export Data</h2>
        <br />
        <Button
          size="lg"
          variant="dark"
          onClick={() => doExport()}
          disabled={importLoading}
        >
          Export
        </Button>
        {/* Status text */}
        <div style={{ marginTop: 8 }}>
          {exportError && <p style={{ color: '#d9534f' }}>{exportError}</p>}
        </div>
      </div>

      <div style={{ marginTop: '50px' }} />

      <div>
        <h2>Import Data</h2>
        <br />
        <Button
          size="lg"
          variant="dark"
          className="me-2"
          onClick={handleUploadClick}
        >
          Upload
        </Button>
        <Button
          size="lg"
          variant="dark"
          disabled={Boolean(!fileName) || Boolean(importError) || importLoading}
          onClick={() => {
            void doImport();
          }}
        >
          Import
          {importLoading && (
            <>
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json,text/json"
          style={{ display: 'none' }}
          disabled={importLoading}
          onChange={handleFileChange}
        />

        {/* Status text */}
        <div style={{ marginTop: 8 }}>
          {fileName && (
            <p>
              Selected file: <strong>{fileName}</strong>
            </p>
          )}
          {importError && <p style={{ color: '#d9534f' }}>{importError}</p>}
        </div>

        {/* Import result */}
        <div style={{ marginTop: 8 }}>
          {importResult && (
            <>
              <div>
                Number of vehicles imported: {importResult.vehicleCount}
              </div>
              <div>
                Number of repair logs imported: {importResult.repairLogCount}
              </div>
              <div>
                Number of scheduled logs imported:{' '}
                {importResult.scheduledLogCount}
              </div>
              <div>
                Number of scheduled service types imported:{' '}
                {importResult.scheduledServiceTypeCount}
              </div>
              <div>
                Number of scheduled service instances imported:{' '}
                {importResult.scheduledServiceInstanceCount}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportExport;
