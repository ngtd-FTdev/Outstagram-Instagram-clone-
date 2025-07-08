import Inbox from './Inbox'
import RequestsMessage from './RequestsMessage'

function RightBar() {
    return (
        <>
            <div className='relative flex h-screen max-w-[--max-w-sidebar-mess] flex-col'>
                <Inbox />

                {/* Các trang phụ... */}
            </div>
        </>
    )
}

export default RightBar
