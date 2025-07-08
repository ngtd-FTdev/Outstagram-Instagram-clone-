import './index.css'

const SpinnerIn = ({ classname }) => {
    return (
        <svg className={`spinner ${classname}`} viewBox='0 0 24 24'>
            <circle
                className='spinner-ring'
                cx='12'
                cy='12'
                r='11'
                fill='none'
                strokeWidth='2'
                strokeDasharray='69.115'
            />
        </svg>
    )
}

export default SpinnerIn
