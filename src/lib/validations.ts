import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const projectSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleVi: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionVi: z.string().min(1),
  thumbnailUrl: z.string().optional().default(''),
  liveUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  tags: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleVi: z.string().min(1),
  excerptEn: z.string().optional().default(''),
  excerptVi: z.string().optional().default(''),
  contentEn: z.string().optional().default(''),
  contentVi: z.string().optional().default(''),
  thumbnailUrl: z.string().optional().default(''),
  category: z.string().optional().default('general'),
  tags: z.string().optional().default(''),
  published: z.boolean().optional().default(false),
  readingTime: z.number().optional().default(5),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type BlogPostData = z.infer<typeof blogPostSchema>;
