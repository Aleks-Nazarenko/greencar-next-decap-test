import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content/pages/test.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: data.title || '',
      content: contentHtml,
    },
  };
}
export default function Home({ title, content }) {
  return (
      <main>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
  );
}
