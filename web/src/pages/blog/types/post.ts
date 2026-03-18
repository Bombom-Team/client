export interface Post {
  postId: string;
  title: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  description?: string;
  hashTags: string[];
}
