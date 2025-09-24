export interface AppEntry {
  id: string;
  type: 'task' | 'payment' | 'alert' | 'news';
  message: string;
  createdAt: Date;
  read: boolean;
}