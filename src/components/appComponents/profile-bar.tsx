import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiBellOn } from "react-icons/ci";
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { IDataUser } from '@/models/dto/IDataUser';

export const ProfileBar: FC<{ user: IDataUser }> = ({ user }) => {
  return (
    <div className='px-4 flex items-center gap-4 justify-between w-full py-2'>
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
          <h1 className='text-[18px] font-bold w-[250px] text-nowrap text-ellipsis overflow-hidden'>{user ? `${user.lastName} ${user.firstName}` : 'Test user'}</h1>
          <h1 className='text-[#c448a4] font-bold text-[16px]'>{user.admins ? 'Администратор' : 'Пользователь'}</h1>
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