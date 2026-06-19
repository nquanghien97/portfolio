import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    },
  });
  console.log('✅ Admin user created');

  // Create placeholder projects
  const projects = [
    {
      slug: 'ecommerce-platform',
      titleEn: 'E-Commerce Platform',
      titleVi: 'Nền tảng Thương mại Điện tử',
      descriptionEn: 'A modern, full-featured e-commerce platform with real-time inventory management, payment processing, and responsive design.',
      descriptionVi: 'Nền tảng thương mại điện tử hiện đại với quản lý kho hàng thời gian thực, xử lý thanh toán và thiết kế responsive.',
      tags: 'Next.js,TypeScript,Prisma,Stripe,TailwindCSS',
      featured: true,
      order: 1,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
    },
    {
      slug: 'saas-analytics-dashboard',
      titleEn: 'SaaS Analytics Dashboard',
      titleVi: 'Dashboard Phân tích SaaS',
      descriptionEn: 'Real-time analytics dashboard with interactive charts, data visualization, and customizable reports for SaaS businesses.',
      descriptionVi: 'Dashboard phân tích thời gian thực với biểu đồ tương tác, trực quan hóa dữ liệu và báo cáo tùy chỉnh cho doanh nghiệp SaaS.',
      tags: 'React,D3.js,Node.js,PostgreSQL,WebSocket',
      featured: true,
      order: 2,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
    },
    {
      slug: 'ai-content-generator',
      titleEn: 'AI Content Generator',
      titleVi: 'Trình tạo nội dung AI',
      descriptionEn: 'An AI-powered tool that generates marketing content, blog posts, and social media copy using GPT technology.',
      descriptionVi: 'Công cụ AI tạo nội dung marketing, bài blog và nội dung mạng xã hội sử dụng công nghệ GPT.',
      tags: 'Next.js,OpenAI,TailwindCSS,Vercel,TypeScript',
      featured: true,
      order: 3,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
    },
    {
      slug: 'task-management-app',
      titleEn: 'Task Management App',
      titleVi: 'Ứng dụng Quản lý Công việc',
      descriptionEn: 'A collaborative task management application with drag-and-drop, real-time updates, and team collaboration features.',
      descriptionVi: 'Ứng dụng quản lý công việc cộng tác với kéo-thả, cập nhật thời gian thực và tính năng làm việc nhóm.',
      tags: 'React,NestJS,MongoDB,Socket.io,Docker',
      featured: false,
      order: 4,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }
  console.log(`✅ ${projects.length} projects created`);

  // Create placeholder blog posts
  const posts = [
    {
      slug: 'getting-started-with-nextjs-16',
      titleEn: 'Getting Started with Next.js 16',
      titleVi: 'Bắt đầu với Next.js 16',
      excerptEn: 'A comprehensive guide to building modern web applications with Next.js 16 and its new features.',
      excerptVi: 'Hướng dẫn toàn diện để xây dựng ứng dụng web hiện đại với Next.js 16 và các tính năng mới.',
      contentEn: 'Next.js 16 brings exciting new features including improved performance, better developer experience, and enhanced routing capabilities...',
      contentVi: 'Next.js 16 mang đến nhiều tính năng mới thú vị bao gồm hiệu suất cải thiện, trải nghiệm developer tốt hơn và khả năng routing nâng cao...',
      category: 'web-development',
      tags: 'Next.js,React,TypeScript',
      published: true,
      readingTime: 8,
    },
    {
      slug: 'building-scalable-apis-with-nestjs',
      titleEn: 'Building Scalable APIs with NestJS',
      titleVi: 'Xây dựng API có thể mở rộng với NestJS',
      excerptEn: 'Learn how to design and implement scalable, maintainable APIs using NestJS framework.',
      excerptVi: 'Tìm hiểu cách thiết kế và triển khai API có thể mở rộng, dễ bảo trì bằng framework NestJS.',
      contentEn: 'NestJS provides a robust framework for building server-side applications with TypeScript...',
      contentVi: 'NestJS cung cấp một framework mạnh mẽ để xây dựng ứng dụng server-side với TypeScript...',
      category: 'backend',
      tags: 'NestJS,Node.js,TypeScript,API',
      published: true,
      readingTime: 12,
    },
    {
      slug: 'modern-css-techniques-2026',
      titleEn: 'Modern CSS Techniques in 2026',
      titleVi: 'Kỹ thuật CSS hiện đại 2026',
      excerptEn: 'Explore the latest CSS features and techniques that are shaping modern web design.',
      excerptVi: 'Khám phá các tính năng và kỹ thuật CSS mới nhất đang định hình thiết kế web hiện đại.',
      contentEn: 'CSS has evolved dramatically, with new features like container queries, cascade layers, and subgrid...',
      contentVi: 'CSS đã phát triển đáng kể, với các tính năng mới như container queries, cascade layers và subgrid...',
      category: 'design',
      tags: 'CSS,TailwindCSS,Design',
      published: true,
      readingTime: 6,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅ ${posts.length} blog posts created`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
