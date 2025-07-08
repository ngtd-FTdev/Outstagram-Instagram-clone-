import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
} from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

function PopoverCom({
    children,
    BodyPop,
    modal = false,
    side = 'top',
    align = 'start',
    asChild = false,
    ArrowPop = false,
    sideOffset = 10,
    className,
    classTrigger,
    open,
    onOpenChange,
    ...props
}) {
    return (
        <Popover modal={modal} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger className={classTrigger} asChild={asChild}>{children}</PopoverTrigger>
            <PopoverPortal>
                <PopoverContent
                    side={side}
                    sideOffset={sideOffset}
                    align={align}
                    className={cn(
                        'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                        className
                    )}
                    {...props}
                >
                    {BodyPop ? <BodyPop /> : <></>}
                    {ArrowPop && (
                        <PopoverArrow
                            className='fill-[--ig-elevated-background]'
                            width={20}
                            height={10}
                        />
                    )}
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    )
}

export default PopoverCom
