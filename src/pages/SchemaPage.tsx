import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import { Provider as MosaicProvider } from '@stoplight/mosaic';
import '@stoplight/mosaic/styles.css';
import schema from '../../pbtar_schema.json';

export const SchemaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-rmigray-800 mb-4">PBTAR Data Schema Documentation</h1>
        
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-rmigray-700 mb-6">
            This page provides interactive documentation for the PBTAR (Pathways-Based Transition Assessment Repository) data schema. 
            The schema defines the structure of scenario data used throughout the application.
          </p>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-rmigray-600 mb-2">
              <strong>Raw Schema:</strong> You can access the raw JSON Schema at{' '}
              <a 
                href="/schema.json" 
                className="text-energy hover:text-energy-700 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                /schema.json
              </a>
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden schema-viewer-container">
            <MosaicProvider>
              <JsonSchemaViewer schema={schema} />
            </MosaicProvider>
          </div>
        </section>
      </div>

      <style>{`
        .schema-viewer-container {
          --color-canvas-100: #ffffff;
          --color-canvas-200: #f8f9fa;
          --color-canvas-300: #f1f3f5;
          --color-primary: var(--color-energy);
          --color-primary-tint: var(--color-energy-100);
          --color-on-primary: #ffffff;
          --sl-color-text-body: var(--color-rmigray-700);
          --sl-color-text-heading: var(--color-rmigray-800);
          padding: 1rem;
        }
        .schema-viewer-container [class*="SchemaViewer"] {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default SchemaPage;
