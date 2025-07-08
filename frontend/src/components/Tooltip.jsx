import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger,
} from '@radix-ui/react-tooltip'

const TooltipCom = ({ children, content }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipPortal className='select-none'>
                    <TooltipContent
                        className='z-50 overflow-hidden rounded-[25px] bg-[--ig-elevated-background] px-3 py-2 text-sm text-[--ig-primary-text] shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-in fade-in-0 zoom-in-95'
                        side='top'
                        align='center'
                        sideOffset={4}
                    >
                        {content}
                        <TooltipArrow className='fill-[--ig-elevated-background]' />
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipCom
