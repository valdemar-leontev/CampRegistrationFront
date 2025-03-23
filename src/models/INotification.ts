export interface INotification {
  id: number,
  title: string,
  content: string,
  date: Date,
  isRead: boolean,
  icon: string,
  isDeleted: boolean
  telegramId: string;
}