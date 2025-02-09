import { formatDistanceToNow } from 'date-fns';
import {
    Tabs,TabsContent,TabsList,TabsTrigger
} from './ui/tabs';


const NotificationTab = ({
    unreadNotifications,
    markAllRead,
    readNotifications,
}) => {
    return (
        <Tabs defaultValue='Unread' className='w-[350px] '>
            <div className="flex justify-between items-center p-2">
                <TabsList className='grid grid-cols-2 w-full bg-gray-200 rounded-lg p-1'>
                    <TabsTrigger value='Unread'>UNREAD</TabsTrigger>
                    <TabsTrigger value='Read'>READ</TabsTrigger>
                </TabsList>
                {unreadNotifications.length > 0 && (
                    <button onClick={markAllRead} className='text-xs text-blue-600 hover:text-blue-800 transition'>
                        Mark All as Read
                    </button>
                )}
            </div>
            <TabsContent value='Unread'>
                {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((notification,index) => (
                        <div className='p-3 border-b border-gray-200 hover:bg-gray-100 rounded-md' key={index}>
                            <div className='flex flex-col gap-1 text-xs text-gray-500 mt-1'
                            >
                                <p className='text-sm text-gray-800'
                                >
                                    {notification.message}
                                </p>
                                {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-gray-500 p-3'>No Unread Notifications</p>
                )}
            </TabsContent>
            <TabsContent value='Read'>
                {readNotifications.length > 0 ? (
                        readNotifications.map((notification,index) => (
                            <div
                                key={index}
                                className='p-3 border-b border-gray-200 hover:bg-gray-100 rounded-md'
                            >
                                <p className='text-sm text-gray-500'>
                                    {notification.message}
                                </p>
                                <div className='flex items-center justify-between text-xs text-gray-500 mt-1'>
                                    {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-500 p-3'>No Read Notifications</p>
                )}
            </TabsContent>
        </Tabs>
    )
}

export default NotificationTab