import normalFilter from '@/assets/img/NormalFilter.jpg'
import { imageFilters } from '@/constants/CreatePost'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './styles.css'
import BidirectionalSlider from '@/components/Sliders/BidirectionalSlider'
import SliderCom from '@/components/Sliders/Slider'
import { useDispatch, useSelector } from 'react-redux'
import { setAdjustments, setFilter } from '@/redux/features/createPost'

function FiltersEdit() {
    const indexSelectedMedia = useSelector(
        state => state.createPost.indexSelectedMedia
    )
    const dispatch = useDispatch()

    const handleChooseFilter = (filter) => {
        dispatch(setFilter({ mediaIndex: indexSelectedMedia, filter: filter }))
    }

    return (
        <div className='mx-2 flex flex-wrap'>
            {imageFilters?.map(filter => {
                const filterString = Object.entries(filter.filter)
                    .map(([key, value]) => `${key}(${value})`)
                    .join(' ');
                return (
                    <div key={filter.name} className='mt-4 flex w-1/3'>
                        <button onClick={() => handleChooseFilter(filter)} className='text-sm font-semibold'>
                            <div className='mx-2 mb-2 overflow-hidden rounded-[4px]'>
                                <img
                                    src={normalFilter}
                                    alt={filter.name}
                                    style={{ filter: filterString }}
                                />
                            </div>
                            <div className='text-xs text-[--ig-secondary-text]'>
                                {filter.name}
                            </div>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

function AdjustmentsEdit() {
    const indexSelectedMedia = useSelector(
        state => state.createPost.indexSelectedMedia
    )
    const adjustments = useSelector(
        state => state.createPost.mediaPosts[indexSelectedMedia]?.edit?.Adjustments
    ) || {
        brightness: 0,
        contrast: 0,
        fade: 0,
        saturation: 0,
        temperature: 0,
        vignette: 0,
    }
    const dispatch = useDispatch()

    const handleAdjustmentChange = (type, value) => {
        const newAdjustments = { ...adjustments, [type]: value }
        dispatch(setAdjustments({ mediaIndex: indexSelectedMedia, adjustments: newAdjustments }))
    }

    const handleReset = type => {
        const newAdjustments = { ...adjustments, [type]: 0 }
        dispatch(setAdjustments({ mediaIndex: indexSelectedMedia, adjustments: newAdjustments }))
    }

    const adjustmentControls = [
        {
            name: 'Brightness',
            key: 'brightness',
            min: -100,
            max: 100,
            type: 'bidirectional',
        },
        {
            name: 'Contrast',
            key: 'contrast',
            min: -100,
            max: 100,
            type: 'bidirectional',
        },
        {
            name: 'Fade',
            key: 'fade',
            min: -100,
            max: 100,
            type: 'bidirectional',
        },
        {
            name: 'Saturation',
            key: 'saturation',
            min: -100,
            max: 100,
            type: 'bidirectional',
        },
        {
            name: 'Temperature',
            key: 'temperature',
            min: -100,
            max: 100,
            type: 'bidirectional',
        },
        {
            name: 'Vignette',
            key: 'vignette',
            min: -100,
            max: 100,
            type: 'slider',
        },
    ]

    return (
        <div className='mx-4 mb-[16px] flex flex-col gap-6'>
            {adjustmentControls.map(control => (
                <div key={control.key} className='group flex flex-col gap-2'>
                    <div className='flex justify-between py-[14px]'>
                        <span className='text-base leading-5 text-[--ig-primary-text]'>
                            {control.name}
                        </span>
                        {adjustments[control.key] !== 0 && (
                            <button
                                onClick={() => handleReset(control.key)}
                                className='hidden text-sm font-medium text-[#0095F6] hover:text-[--ig-link] active:opacity-50 group-hover:block'
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    <div className='flex flex-nowrap gap-2'>
                        <div className='relative flex-grow'>
                            {control?.type === 'bidirectional' ? (
                                <BidirectionalSlider
                                    keyInput={control.key}
                                    valueInput={adjustments[control.key]}
                                    onChange={handleAdjustmentChange}
                                />
                            ) : (
                                <SliderCom
                                    keyInput={control.key}
                                    valueInput={adjustments[control.key]}
                                    onChange={handleAdjustmentChange}
                                />
                            )}
                        </div>
                        <div className='flex w-6 items-center justify-end'>
                            <span
                                className={`text-xs ${
                                    adjustments[control.key] === 0
                                        ? 'text-[--ig-secondary-text]'
                                        : 'text-[--ig-primary-text]'
                                }`}
                            >
                                {adjustments[control.key]}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function EditImage() {
    const [chooseEdit, setChooseEdit] = useState('filters')

    return (
        <div className='relative w-[--creation-settings-width] z-20 overflow-y-scroll border-l border-[--ig-elevated-separator]'>
            <div className='flex absolute inset-0 flex-grow flex-col'>
                <div className='grid flex-grow grid-cols-2'>
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: chooseEdit === 'filters' ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                        className='flex cursor-pointer items-center justify-center border-b border-[--ig-primary-text] py-3 text-sm font-semibold leading-[18px] text-[--ig-link]'
                        onClick={() => setChooseEdit('filters')}
                    >
                        Filters
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: chooseEdit === 'adjustments' ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                        className='flex cursor-pointer items-center justify-center border-b border-[--ig-primary-text] py-3 text-sm font-semibold leading-[18px] text-[--ig-link]'
                        onClick={() => setChooseEdit('adjustments')}
                    >
                        Adjustments
                    </motion.div>
                </div>
                {chooseEdit === 'filters' ? (
                    <FiltersEdit />
                ) : (
                    <AdjustmentsEdit />
                )}
            </div>
        </div>
    )
}

export default EditImage
