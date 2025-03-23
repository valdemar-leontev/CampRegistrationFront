import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CiBellOn } from "react-icons/ci";
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  LeadingActions,
  TrailingActions,
  Type,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useUserStore } from '@/stores/UserStore';
import apiClient from '@/axios';
import { INotification } from '@/models/INotification';
import dayjs from 'dayjs';

export const ProfileBar = () => {
  const [notificationsList, setNotificationsList] = useState<INotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();

  const leadingActions = (id: number) => {
    const notification = notificationsList.find((n) => n.id === id);
    if (notification?.isRead) {
      return null;
    }

    return (
      <LeadingActions>
        <SwipeAction onClick={async () => await readNotificationAsync(id)}>
          <div className="flex items-center justify-center h-full bg-blue-500 text-white px-4">
            Прочитано
          </div>
        </SwipeAction>
      </LeadingActions>
    );
  };

  const trailingActions = (id: number) => (
    <TrailingActions>
      <SwipeAction
        destructive
        onClick={async () => await deleteNotificationAsync(id)}
      >
        <div className="flex items-center justify-center h-full bg-red-500 text-white px-4">
          Удалить
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  const readNotificationAsync = useCallback(async (id: number) => {
    const response = await apiClient.put<INotification>(`notifications/read/${id}`);

    if (response.status === 200) {
      setNotificationsList((prev) => {
        const updatedList = prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        );
        return updatedList.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
      });
    }

  }, []);

  const deleteNotificationAsync = useCallback(async (id: number) => {
    const response = await apiClient.put<INotification>(`notifications/delete/${id}`);

    if (response.status === 200) {
      setNotificationsList((prev) => prev.filter((item) => item.id !== id));
    }
  }, [])

  useEffect(() => {
    (async () => {
      const response = await apiClient.get<INotification[]>(`notifications/${user!.telegramId}`);

      if (response.status === 200) {
        setNotificationsList(response.data);
      }
    })()
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    user && <div className='px-4 flex items-center gap-4 justify-between w-full py-2'>
      <div className='flex items-center gap-4'>
        {(!user || !user.photoUrl) ? (
          <Skeleton className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl" />
        ) : (
          <Avatar>
            <AvatarImage src={user.photoUrl} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        )}
        <div className='flex flex-col text-left'>
          <h1 className='text-[18px] font-bold max-w-[220px] text-nowrap text-ellipsis overflow-hidden'>
            {user ? `${user.lastName} ${user.firstName}` : 'Test user'}
          </h1>
          <h1 className='text-[#c448a4] font-bold text-[16px]'>
            {user.admins.length > 0 ? 'Администратор' : 'Пользователь'}
          </h1>
        </div>
      </div>

      {isOpen && <div className='w-screen h-screen absolute top-0 left-0 z-[100]' onClick={() => setIsOpen((prev) => !prev)} />}

      <motion.div
        className="relative !min-w-10 !min-h-10 rounded-full shadow flex justify-center items-center cursor-pointer"
        whileTap={{ scale: 0.8, opacity: 0.7 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <CiBellOn size={30} />
        {notificationsList.some(notification => !notification.isRead) && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-blue-500 rounded-full"></span>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={notificationsRef}
            className="fixed top-16 right-4 w-80 !bg-white shadow-2xl  overflow-auto z-[1000000] max-h-[280px] rounded-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <AnimatePresence>
              {showSwipeHint && notificationsList.length !== 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="p-2 text-center text-sm text-gray-500 bg-gray-100"
                >
                  Смахивайте влево или вправо для действий
                </motion.div>
              )}
              {notificationsList.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-gray-700">Нет новых уведомлений</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Здесь будут появляться ваши уведомления. Проверьте позже!
                  </p>
                </div>
              )}
            </AnimatePresence>
            <SwipeableList type={Type.IOS} fullSwipe>
              {notificationsList.map((notification) => (
                <SwipeableListItem
                  key={notification.id}
                  leadingActions={leadingActions(notification.id)}
                  trailingActions={trailingActions(notification.id)}
                >
                  <div className={`p-4 flex flex-col gap-2 w-full text-left ${notification.isRead ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{notification.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <p className="text-xs text-gray-600">{notification.content}</p>
                        <span className="text-xs text-gray-400">{dayjs(notification.date).format('D MMMM')}</span>
                      </div>
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </SwipeableListItem>
              ))}
            </SwipeableList>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};