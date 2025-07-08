import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
} from 'date-fns'

const TimeAgo = ({ date, ...props }) => {
    const pastDate = new Date(date)

    if (!date || isNaN(pastDate.getTime())) return <></>

    const now = new Date()
    let display = ''

    const years = differenceInYears(now, pastDate)
    if (years >= 1) {
        display = `${years}y`
    } else {
        const months = differenceInMonths(now, pastDate)
        if (months >= 1) {
            display = `${months}mo`
        } else {
            const weeks = differenceInWeeks(now, pastDate)
            if (weeks >= 1) {
                display = `${weeks}w`
            } else {
                const days = differenceInDays(now, pastDate)
                if (days >= 1) {
                    display = `${days}d`
                } else {
                    const hours = differenceInHours(now, pastDate)
                    if (hours >= 1) {
                        display = `${hours}h`
                    } else {
                        const minutes = differenceInMinutes(now, pastDate)
                        if (minutes >= 1) {
                            display = `${minutes}m`
                        } else {
                            const seconds = differenceInSeconds(now, pastDate)
                            if (seconds >= 1) {
                                display = `${seconds}s`
                            } else {
                                display = 'Just now'
                            }
                        }
                    }
                }
            }
        }
    }

    return (
        <time
            dateTime={pastDate.toISOString()}
            title={pastDate.toLocaleString()}
            {...props}
        >
            {display}
        </time>
    )
}

export default TimeAgo
