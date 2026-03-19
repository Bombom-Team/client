export interface PostListItem {
  postId: string;
  title: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  description?: string;
}

export interface PostDetail {
  title: string;
  content: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  hashTags: string[];
}
