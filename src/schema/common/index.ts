import type { SchemaObject } from "ajv";

// Use explicit type per import to make sure the JSON is treated as an AJV schema
import publicationSchemaJson from "./publication.v1.json" with { type: "json" };
export const publicationSchema: SchemaObject =
  publicationSchemaJson as SchemaObject;

import labelSchemaJson from "./label.v1.json" with { type: "json" };
export const labelSchema: SchemaObject = labelSchemaJson as SchemaObject;

import geographyItemSchemaJson from "./geographyItem.v1.json" with { type: "json" };
export const geographyItemSchema: SchemaObject =
  geographyItemSchemaJson as SchemaObject;

// Aggregate — type stays correct
export const commonSchemas: SchemaObject[] = [
  publicationSchema,
  labelSchema,
  geographyItemSchema,
];

export default commonSchemas;
