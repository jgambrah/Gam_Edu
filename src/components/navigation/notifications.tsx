'use client';

import { useState } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: any;
}

export default function NotificationBell() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isOpen, setIsOpen] = useState(false);

    const notificationsQuery = useMemoFirebase(
        () => (user && firestore) ? query(collection(firestore, 'notifications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(25)) : null,
        [firestore, user]
    );
    const { data: notifications } = useCollection<Notification>(notificationsQuery);

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const handleMarkAsRead = async (notificationId: string) => {
        if (!firestore) return;
        const notificationRef = doc(firestore, 'notifications', notificationId);
        try {
            await updateDoc(notificationRef, { read: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };
    
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        // Optional: Mark all as read when dropdown is opened
        if (open && notifications) {
            notifications.forEach(n => {
                if (!n.read) handleMarkAsRead(n.id);
            });
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5"/>
                    {unreadCount > 0 && (
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                            {unreadCount}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 font-semibold border-b">Notifications</div>
                <ScrollArea className="h-96">
                     <div className="p-4 space-y-4">
                        {notifications && notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm">{n.title}</p>
                                        {!n.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{n.message}</p>
                                    <p className="text-[10px] text-slate-400">{formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true })}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-muted-foreground py-10">
                                <Mail className="mx-auto h-8 w-8 mb-2 opacity-50"/>
                                No notifications
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}