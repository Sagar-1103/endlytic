import { z } from "zod";

const urlSchema = z
  .union([
    z.string(),
    z.object({
      raw: z.string(),
      protocol: z.string().optional(),
      host: z.array(z.string()).optional(),
      path: z.array(z.string()).optional(),
      query: z
        .array(
          z.object({
            key: z.string(),
            value: z.string().optional(),
            disabled: z.boolean().optional(),
          })
        )
        .optional(),
      variable: z
        .array(
          z.object({
            key: z.string(),
            value: z.string().optional(),
            description: z
              .union([z.string(), z.object({ content: z.string() })])
              .optional(),
          })
        )
        .optional(),
    }),
  ])
  .optional();

const bodySchema = z
  .object({
    mode: z.string().optional(),
    raw: z.string().optional(),
    formdata: z
      .array(
        z.object({
          key: z.string(),
          value: z.string().optional(),
          type: z.string().optional(),
        })
      )
      .optional(),
    urlencoded: z
      .array(
        z.object({
          key: z.string(),
          value: z.string().optional(),
          disabled: z.boolean().optional(),
        })
      )
      .optional(),
  })
  .optional();

const headerSchema = z
  .array(
    z.object({
      key: z.string(),
      value: z.string(),
      description: z.string().optional(),
      disabled: z.boolean().optional(),
    })
  )
  .optional();

const requestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]),
  header: headerSchema,
  body: bodySchema.optional(),
  url: urlSchema,
});

const responseSchema = z.object({
  name: z.string(),
  originalRequest: requestSchema.optional(),
  status: z.string().optional(),
  code: z.number().optional(),
  _postman_previewlanguage: z.string().optional(),
  header: headerSchema.optional(),
  body: z.string().optional(),
});

const itemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().optional(),
    request: requestSchema.optional(),
    response: z.array(responseSchema).optional(),
    item: z.array(itemSchema).optional(),
  })
);

const infoSchema = z.object({
  _postman_id: z.string(),
  name: z.string(),
  description: z
    .union([z.string(), z.object({ content: z.string() })])
    .optional(),
});

export const postmanCollectionSchema = z
  .object({
    info: infoSchema,
    item: z.array(itemSchema),
  })
  .transform((data) => ({
    id: data.info._postman_id,
    collectionName: data.info.name,
    collectionDescription: data.info.description,
    item: data.item,
  }));