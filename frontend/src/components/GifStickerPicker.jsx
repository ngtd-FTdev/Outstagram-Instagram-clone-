import { useState, useEffect } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    PopoverArrow,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@radix-ui/react-popover'

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

const GifStickerPicker = ({ onSelect, children }) => {
    const [activeTab, setActiveTab] = useState('stickers')
    const [searchQuery, setSearchQuery] = useState('')
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const fetchItems = async () => {
        setIsLoading(true)
        try {
            let result
            const options = {
                limit: 24,
                rating: 'g',
                lang: 'en',
            }

            if (activeTab === 'stickers') {
                if (searchQuery) {
                    result = await gf.search(searchQuery, {
                        ...options,
                        type: 'stickers',
                    })
                } else {
                    result = await gf.trending({
                        ...options,
                        type: 'stickers',
                    })
                }
            } else {
                if (searchQuery) {
                    result = await gf.search(searchQuery, {
                        ...options,
                        type: 'gifs',
                    })
                } else {
                    result = await gf.trending({
                        ...options,
                        type: 'gifs',
                    })
                }
            }

            setItems(result.data)
        } catch (error) {
            console.error('Error fetching from GIPHY:', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (isOpen) {
            fetchItems()
        }
    }, [isOpen, activeTab, searchQuery])

    const handleSelect = item => {
        console.log('item.images.fixed_height.url::', item.images.fixed_height.url);
        onSelect?.({
            type: activeTab,
            url: item.images.fixed_height.url,
            id: item.id,
        })
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className='w-[350px] space-y-3 rounded-xl border border-[--ig-elevated-separator] bg-[--ig-elevated-background] p-0 shadow-lg'
                side='top'
                align='end'
            >
                <Tabs
                    defaultValue='stickers'
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className='w-full'
                >
                    <TabsList className='grid w-full grid-cols-2 gap-4 bg-transparent p-2'>
                        <TabsTrigger
                            value='stickers'
                            className='rounded-none text-[--ig-secondary-text] data-[state=active]:border-b-[1px] data-[state=active]:border-b-[--ig-primary-text] data-[state=active]:bg-[--ig-highlight-background] data-[state=active]:text-[--ig-primary-text]'
                        >
                            Stickers
                        </TabsTrigger>
                        <TabsTrigger
                            value='gifs'
                            className='ded rounded-none text-[--ig-secondary-text] data-[state=active]:border-b-[1px] data-[state=active]:border-b-[--ig-primary-text] data-[state=active]:bg-[--ig-highlight-background] data-[state=active]:text-[--ig-primary-text]'
                        >
                            GIFs
                        </TabsTrigger>
                    </TabsList>

                    <div className='p-2'>
                        <div className='relative mb-2'>
                            <input
                                type='text'
                                placeholder={`Search ${activeTab === 'stickers' ? 'stickers' : 'GIPHY'}`}
                                className='w-full rounded-lg bg-[--ig-secondary-background] px-4 py-2 text-sm text-[--ig-primary-text] placeholder-[--ig-secondary-text] focus:outline-none'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className='h-[350px] overflow-y-auto p-2'>
                            {isLoading ? (
                                <div className='flex h-full items-center justify-center'>
                                    <div className='text-[--ig-secondary-text]'>
                                        Loading...
                                    </div>
                                </div>
                            ) : items.length === 0 ? (
                                <div className='flex h-full items-center justify-center'>
                                    <div className='text-[--ig-secondary-text]'>
                                        No results found
                                    </div>
                                </div>
                            ) : (
                                <div className='grid grid-cols-3 gap-2'>
                                    {items.map(item => (
                                        <div
                                            key={item.id}
                                            className='relative cursor-pointer pb-[100%]'
                                            onClick={() => handleSelect(item)}
                                        >
                                            <div className='absolute inset-0 overflow-hidden rounded-lg'>
                                                <img
                                                    src={
                                                        item.images.fixed_width
                                                            .url
                                                    }
                                                    alt={item.title}
                                                    className='h-full w-full object-cover'
                                                    loading='lazy'
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Tabs>
                <PopoverArrow className='fill-[--ig-elevated-background] w-[20px] h-[10px]' />
            </PopoverContent>
        </Popover>
    )
}

export default GifStickerPicker
