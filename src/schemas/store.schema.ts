import { z } from "zod";

// ==== changes here: Allow dashes in phone numbers
const phoneRegex = /^[\d-]+$/;
const socialMediaRegex = /^(@?[a-zA-Z0-9._-]+)$/;
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const StoreSchema = {
  stepOne: z.object({
    name: z
      .string()
      .nonempty({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be at most 255 characters long"),
    currencyCode: z.string().nonempty({ message: "Currency is required" }),
    logoFile: z
      .instanceof(File, { message: "Logo is required" })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Logo must be less than 5MB",
      }),
  }),
  stepTwo: z.object({
    color: z
      .string({ error: "Color is required" })
      .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  }),
  stepThree: z.object({
    phoneNumber: z
      .string()
      .nonempty({ message: "WhatsApp number is required" })
      .refine((val) => !val || phoneRegex.test(val), {
        error: "WhatsApp number must contain only digits and dashes",
      }),
    instagram: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid Instagram format",
      }),
    facebook: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    tiktok: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid TikTok format",
      }),
    slug: z
      .string()
      .nonempty({ message: "Slug is required" })
      .min(2, "Slug must be at least 2 characters long")
      .max(255, "Slug must be at most 255 characters long")
      .refine((val) => slugRegex.test(val), {
        message:
          "Slug must be lowercase, alphanumeric, and can include hyphens",
      }),
  }),
  createStore: z.object({
    name: z
      .string()
      .nonempty({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be at most 255 characters long"),
    currencyCode: z.string().nonempty({ message: "Currency is required" }),
    color: z
      .string({ error: "Color is required" })
      .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
    phoneNumber: z
      .string()
      .nonempty({ message: "WhatsApp number is required" })
      .refine((val) => !val || phoneRegex.test(val), {
        error: "WhatsApp number must contain only digits and dashes",
      }),
    instagram: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid Instagram format",
      }),
    facebook: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    tiktok: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid TikTok format",
      }),
    slug: z
      .string()
      .nonempty({ message: "Slug is required" })
      .min(2, "Slug must be at least 2 characters long")
      .max(255, "Slug must be at most 255 characters long")
      .refine((val) => slugRegex.test(val), {
        message:
          "Slug must be lowercase, alphanumeric, and can include hyphens",
      }),
  }),
  updateStore: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters long"),
    currency: z.string().nonempty({ message: "Currency is required" }),
    color: z
      .string({ error: "Color is required" })
      .regex(/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
    phoneNumber: z
      .string()
      .nonempty({ message: "Phone number is required" })
      .refine((val) => !val || phoneRegex.test(val), {
        error: "Phone number must contain only digits and dashes",
      }),
    instagram: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid Instagram format",
      }),
    facebook: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    tiktok: z
      .string()
      .optional()
      .refine((val) => !val || socialMediaRegex.test(val), {
        message: "Invalid TikTok format",
      }),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(255, "Slug must be at most 255 characters long")
      .refine((val) => slugRegex.test(val), {
        message:
          "Slug must be lowercase, alphanumeric, and can include hyphens",
      }),
    logoFile: z
      .instanceof(File)
      .nullable()
      .optional()
      .superRefine((file, ctx) => {
        if (file && file.size > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Logo must be less than 5MB",
          });
        }
      }),
  }),
};

export type StepOneData = z.infer<typeof StoreSchema.stepOne>;
export type StepTwoData = z.infer<typeof StoreSchema.stepTwo>;
export type StepThreeData = z.infer<typeof StoreSchema.stepThree>;
export type CreateStoreData = z.infer<typeof StoreSchema.createStore>;
