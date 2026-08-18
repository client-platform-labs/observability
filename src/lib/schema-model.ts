export const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export type PropertyType = "string" | "number" | "boolean" | "object" | "array";

export type PropertyDef = {
  type: PropertyType;
  description?: string;
};

export type EventSchema = {
  schemaVersion: string;
  kind: "event";
  name: string;
  properties: Record<string, PropertyDef>;
};

export type LogSchema = {
  schemaVersion: string;
  kind: "log";
  name: string;
  levels: LogLevel[];
  fields?: Record<string, PropertyDef>;
};

export type ObservabilitySchema = EventSchema | LogSchema;

export type ValidationIssue = {
  file: string;
  message: string;
  pointer?: string;
};

export const EVENT_META_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://client-platform.local/schemas/event.json",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "kind", "name", "properties"],
  properties: {
    schemaVersion: { type: "string", minLength: 1 },
    kind: { const: "event" },
    name: {
      type: "string",
      pattern: "^[a-z][a-z0-9_]*$",
      minLength: 1,
    },
    properties: {
      type: "object",
      minProperties: 0,
      additionalProperties: {
        type: "object",
        required: ["type"],
        additionalProperties: false,
        properties: {
          type: {
            type: "string",
            enum: ["string", "number", "boolean", "object", "array"],
          },
          description: { type: "string" },
        },
      },
    },
  },
} as const;

export const LOG_META_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://client-platform.local/schemas/log.json",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "kind", "name", "levels"],
  properties: {
    schemaVersion: { type: "string", minLength: 1 },
    kind: { const: "log" },
    name: {
      type: "string",
      pattern: "^[a-z][a-z0-9_]*$",
      minLength: 1,
    },
    levels: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "string",
        enum: [...LOG_LEVELS],
      },
    },
    fields: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["type"],
        additionalProperties: false,
        properties: {
          type: {
            type: "string",
            enum: ["string", "number", "boolean", "object", "array"],
          },
          description: { type: "string" },
        },
      },
    },
  },
} as const;
