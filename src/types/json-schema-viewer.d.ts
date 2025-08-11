declare module '@stoplight/json-schema-viewer' {
  export interface JsonSchemaViewerProps {
    schema: any;
  }
  
  export const JsonSchemaViewer: React.FC<JsonSchemaViewerProps>;
}