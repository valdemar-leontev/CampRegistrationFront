import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiBellOn } from "react-icons/ci";
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';

export const ProfileBar: FC<{ user: any }> = ({ user }) => {
  return (
    <div className='sticky top-1 z-50 bg-white p-1 flex items-center gap-4 mb-10 justify-between'>
      <div className='flex items-center gap-4'>
        {(!user || !user.photo_url) ? (
          <Skeleton className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl" />
        ) : (
          <Avatar>
            <AvatarImage src={user.photo_url} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        )}
        <div className='flex flex-col text-left'>
          <h1 className='text-[18px] font-bold'>{user ? `${user.last_name} ${user.first_name}` : 'Test user'}</h1>
          <h1 className='text-[#c448a4] font-bold text-[16px]'>Администратор</h1>
        </div>
      </div>

      <motion.div
        className="w-14 h-14 rounded-full shadow flex justify-center items-center cursor-pointer"
        whileTap={{ scale: 0.8, opacity: 0.7 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <CiBellOn size={30} />
      </motion.div>
    </div>
  )
}