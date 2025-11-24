import type { SchemaObject } from "ajv";

// Use explicit type per import to make sure the JSON is treated as an AJV schema
import publicationSchemaJson from "./publication.v1.json" with { type: "json" };
export const publicationSchema: SchemaObject =
  publicationSchemaJson as SchemaObject;

import sectorSchemaJson from "./sector.v1.json" with { type: "json" };
export const sectorSchema: SchemaObject = sectorSchemaJson as SchemaObject;

import technologySchemaJson from "./technology.v1.json" with { type: "json" };
export const technologySchema: SchemaObject =
  technologySchemaJson as SchemaObject;

import metricSchemaJson from "./metric.v1.json" with { type: "json" };
export const metricSchema: SchemaObject = metricSchemaJson as SchemaObject;

import labelSchemaJson from "./label.v1.json" with { type: "json" };
export const labelSchema: SchemaObject = labelSchemaJson as SchemaObject;

import geographyItemSchemaJson from "./geographyItem.v1.json" with { type: "json" };
export const geographyItemSchema: SchemaObject =
  geographyItemSchemaJson as SchemaObject;

import emissionsScopeSchemaJson from "./emissionsScope.v1.json" with { type: "json" };
export const emissionsScopeSchema: SchemaObject =
  emissionsScopeSchemaJson as SchemaObject;

// Aggregate — type stays correct
export const commonSchemas: SchemaObject[] = [
  publicationSchema,
  sectorSchema,
  technologySchema,
  metricSchema,
  labelSchema,
  geographyItemSchema,
  emissionsScopeSchema,
];

export default commonSchemas;
