import {
    clamp,
    classNames,
    computeCroppedArea,
    getCenter,
    getCropSize,
    getDistanceBetweenPoints,
    getInitialCropFromCroppedAreaPercentages,
    getInitialCropFromCroppedAreaPixels,
    getRotationBetweenPoints,
    restrictPosition,
} from '@/helpers/CropperHelpers'
import normalizeWheel from 'normalize-wheel'
import React from 'react'
import './styles.css'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const KEYBOARD_STEP = 1

class Cropper extends React.Component {
    static defaultProps = {
        zoom: 1,
        rotation: 0,
        aspect: 1 / 1,
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM,
        cropShape: 'rect',
        objectFit: 'contain',
        showGrid: true,
        style: {},
        classes: {},
        mediaProps: {},
        cropperProps: {},
        zoomSpeed: 1,
        restrictPosition: true,
        zoomWithScroll: true,
        keyboardStep: KEYBOARD_STEP,
    }

    constructor(props) {
        super(props)
        this.cropperRef = React.createRef()
        this.imageRef = this.props.cropperRef || React.createRef()
        this.videoRef = this.props.videoRef || React.createRef()
        this.containerPosition = { x: 0, y: 0 }
        this.containerRef = null
        this.styleRef = null
        this.containerRect = null
        this.mediaSize = {
            width: 0,
            height: 0,
            naturalWidth: 0,
            naturalHeight: 0,
        }
        this.dragStartPosition = { x: 0, y: 0 }
        this.dragStartCrop = { x: 0, y: 0 }
        this.gestureZoomStart = 0
        this.gestureRotationStart = 0
        this.isTouching = false
        this.lastPinchDistance = 0
        this.lastPinchRotation = 0
        this.rafDragTimeout = null
        this.rafPinchTimeout = null
        this.wheelTimer = null
        this.currentDoc = typeof document !== 'undefined' ? document : null
        this.currentWindow = typeof window !== 'undefined' ? window : null
        this.resizeObserver = null

        this.state = {
            cropSize: null,
            hasWheelJustStarted: false,
            mediaObjectFit: undefined,
        }
    }

    // Các phương thức lifecycle và logic khác giữ nguyên như trong bản gốc,
    componentDidMount() {
        if (!this.currentDoc || !this.currentWindow) return
        if (this.containerRef) {
            if (this.containerRef.ownerDocument) {
                this.currentDoc = this.containerRef.ownerDocument
            }
            if (this.currentDoc.defaultView) {
                this.currentWindow = this.currentDoc.defaultView
            }

            this.initResizeObserver()
            if (typeof window.ResizeObserver === 'undefined') {
                this.currentWindow.addEventListener('resize', this.computeSizes)
            }
            this.props.zoomWithScroll &&
                this.containerRef.addEventListener('wheel', this.onWheel, {
                    passive: false,
                })
            this.containerRef.addEventListener(
                'gesturestart',
                this.preventZoomSafari
            )
        }

        this.currentDoc.addEventListener('scroll', this.onScroll)

        if (!this.props.disableAutomaticStylesInjection) {
            this.styleRef = this.currentDoc.createElement('style')
            this.styleRef.setAttribute('type', 'text/css')
            if (this.props.nonce) {
                this.styleRef.setAttribute('nonce', this.props.nonce)
            }
            // this.styleRef.innerHTML = cssStyles
            this.currentDoc.head.appendChild(this.styleRef)
        }

        if (this.imageRef.current && this.imageRef.current.complete) {
            this.onMediaLoad()
        }

        if (this.props.setImageRef) {
            this.props.setImageRef(this.imageRef)
        }

        if (this.props.setVideoRef) {
            this.props.setVideoRef(this.videoRef)
        }

        if (this.props.setCropperRef) {
            this.props.setCropperRef(this.cropperRef)
        }
    }

    componentWillUnmount() {
        if (!this.currentDoc || !this.currentWindow) return
        if (typeof window.ResizeObserver === 'undefined') {
            this.currentWindow.removeEventListener('resize', this.computeSizes)
        }
        this.resizeObserver?.disconnect()
        if (this.containerRef) {
            this.containerRef.removeEventListener(
                'gesturestart',
                this.preventZoomSafari
            )
        }

        if (this.styleRef) {
            this.styleRef.parentNode?.removeChild(this.styleRef)
        }

        this.cleanEvents()
        this.props.zoomWithScroll && this.clearScrollEvent()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.aspect !== this.props.aspect) {
            // Reset zoom và crop về mặc định khi aspect thay đổi
            this.props.onZoomChange?.(1)
            this.props.onCropChange?.({ x: 0, y: 0 })
            this.computeSizes()
        }

        if (prevProps.rotation !== this.props.rotation) {
            this.computeSizes()
            this.recomputeCropPosition()
        } else if (prevProps.aspect !== this.props.aspect) {
            this.computeSizes()
        } else if (prevProps.objectFit !== this.props.objectFit) {
            this.computeSizes()
        } else if (prevProps.zoom !== this.props.zoom) {
            this.recomputeCropPosition()
        } else if (
            prevProps.cropSize?.height !== this.props.cropSize?.height ||
            prevProps.cropSize?.width !== this.props.cropSize?.width
        ) {
            this.computeSizes()
        } else if (
            prevProps.crop?.x !== this.props.crop?.x ||
            prevProps.crop?.y !== this.props.crop?.y
        ) {
            this.emitCropAreaChange()
        }
        if (
            prevProps.zoomWithScroll !== this.props.zoomWithScroll &&
            this.containerRef
        ) {
            this.props.zoomWithScroll
                ? this.containerRef.addEventListener('wheel', this.onWheel, {
                      passive: false,
                  })
                : this.clearScrollEvent()
        }
        if (prevProps.video !== this.props.video) {
            this.videoRef.current?.load()
        }

        const objectFit = this.getObjectFit()
        if (objectFit !== this.state.mediaObjectFit) {
            this.setState({ mediaObjectFit: objectFit }, this.computeSizes)
        }
    }

    initResizeObserver = () => {
        if (typeof window.ResizeObserver === 'undefined' || !this.containerRef)
            return
        let isFirstResize = true
        this.resizeObserver = new window.ResizeObserver(entries => {
            if (isFirstResize) {
                isFirstResize = false
                return
            }
            this.computeSizes()
        })
        this.resizeObserver.observe(this.containerRef)
    }

    preventZoomSafari = e => e.preventDefault()

    cleanEvents = () => {
        if (!this.currentDoc) return
        this.currentDoc.removeEventListener('mousemove', this.onMouseMove)
        this.currentDoc.removeEventListener('mouseup', this.onDragStopped)
        this.currentDoc.removeEventListener('touchmove', this.onTouchMove)
        this.currentDoc.removeEventListener('touchend', this.onDragStopped)
        this.currentDoc.removeEventListener('gesturemove', this.onGestureMove)
        this.currentDoc.removeEventListener('gestureend', this.onGestureEnd)
        this.currentDoc.removeEventListener('scroll', this.onScroll)
    }

    clearScrollEvent = () => {
        if (this.containerRef)
            this.containerRef.removeEventListener('wheel', this.onWheel)
        if (this.wheelTimer) clearTimeout(this.wheelTimer)
    }

    onMediaLoad = () => {
        const cropSize = this.computeSizes()
        if (cropSize) {
            this.emitCropData()
            this.setInitialCrop(cropSize)
        }
        if (this.props.onMediaLoaded) {
            this.props.onMediaLoaded(this.mediaSize)
        }
    }

    setInitialCrop = cropSize => {
        if (this.props.initialCroppedAreaPercentages) {
            const { crop, zoom } = getInitialCropFromCroppedAreaPercentages(
                this.props.initialCroppedAreaPercentages,
                this.mediaSize,
                this.props.rotation,
                cropSize,
                this.props.minZoom,
                this.props.maxZoom
            )
            this.props.onCropChange(crop)
            this.props.onZoomChange?.(zoom)
        } else if (this.props.initialCroppedAreaPixels) {
            const { crop, zoom } = getInitialCropFromCroppedAreaPixels(
                this.props.initialCroppedAreaPixels,
                this.mediaSize,
                this.props.rotation,
                cropSize,
                this.props.minZoom,
                this.props.maxZoom
            )
            this.props.onCropChange(crop)
            this.props.onZoomChange?.(zoom)
        }
    }

    getAspect = () => {
        const { cropSize, aspect } = this.props
        return cropSize ? cropSize.width / cropSize.height : aspect
    }

    getObjectFit = () => {
        if (this.props.objectFit === 'cover') {
            const mediaRef = this.imageRef.current || this.videoRef.current
            if (mediaRef && this.containerRef) {
                this.containerRect = this.containerRef.getBoundingClientRect()
                const containerAspect =
                    this.containerRect.width / this.containerRect.height
                const naturalWidth =
                    mediaRef.naturalWidth || mediaRef.videoWidth || 0
                const naturalHeight =
                    mediaRef.naturalHeight || mediaRef.videoHeight || 0
                return naturalWidth / naturalHeight < containerAspect
                    ? 'horizontal-cover'
                    : 'vertical-cover'
            }
            return 'horizontal-cover'
        }
        return this.props.objectFit
    }

    computeSizes = () => {
        const mediaRef = this.imageRef.current || this.videoRef.current
        if (mediaRef && this.containerRef) {
            this.containerRect = this.containerRef.getBoundingClientRect()
            this.saveContainerPosition()
            const containerAspect =
                this.containerRect.width / this.containerRect.height
            const naturalWidth =
                mediaRef.naturalWidth || mediaRef.videoWidth || 0
            const naturalHeight =
                mediaRef.naturalHeight || mediaRef.videoHeight || 0
            const isMediaScaledDown =
                mediaRef.offsetWidth < naturalWidth ||
                mediaRef.offsetHeight < naturalHeight
            const mediaAspect = naturalWidth / naturalHeight

            // We do not rely on the offsetWidth/offsetHeight if the media is scaled down
            // as the values they report are rounded. That will result in precision losses
            // when calculating zoom. We use the fact that the media is positionned relative
            // to the container. That allows us to use the container's dimensions
            // and natural aspect ratio of the media to calculate accurate media size.
            // However, for this to work, the container should not be rotated
            let renderedMediaSize

            if (isMediaScaledDown) {
                switch (this.state.mediaObjectFit) {
                    default:
                    case 'contain':
                        renderedMediaSize =
                            containerAspect > mediaAspect
                                ? {
                                      width:
                                          this.containerRect.height *
                                          mediaAspect,
                                      height: this.containerRect.height,
                                  }
                                : {
                                      width: this.containerRect.width,
                                      height:
                                          this.containerRect.width /
                                          mediaAspect,
                                  }
                        break
                    case 'horizontal-cover':
                        renderedMediaSize = {
                            width: this.containerRect.width,
                            height: this.containerRect.width / mediaAspect,
                        }
                        break
                    case 'vertical-cover':
                        renderedMediaSize = {
                            width: this.containerRect.height * mediaAspect,
                            height: this.containerRect.height,
                        }
                        break
                }
            } else {
                renderedMediaSize = {
                    width: mediaRef.offsetWidth,
                    height: mediaRef.offsetHeight,
                }
            }

            this.mediaSize = {
                ...renderedMediaSize,
                naturalWidth,
                naturalHeight,
            }

            // set media size in the parent
            if (this.props.setMediaSize) {
                this.props.setMediaSize(this.mediaSize)
            }

            const cropSize = this.props.cropSize
                ? this.props.cropSize
                : getCropSize(
                      this.mediaSize.width,
                      this.mediaSize.height,
                      this.containerRect.width,
                      this.containerRect.height,
                      this.props.aspect,
                      this.props.rotation
                  )

            if (
                this.state.cropSize?.height !== cropSize.height ||
                this.state.cropSize?.width !== cropSize.width
            ) {
                this.props.onCropSizeChange &&
                    this.props.onCropSizeChange(cropSize)
            }
            this.setState({ cropSize }, this.recomputeCropPosition)
            // pass crop size to parent
            if (this.props.setCropSize) {
                this.props.setCropSize(cropSize)
            }

            return cropSize
        }
    }

    saveContainerPosition = () => {
        if (this.containerRef) {
            const bounds = this.containerRef.getBoundingClientRect()
            this.containerPosition = { x: bounds.left, y: bounds.top }
        }
    }

    onMouseDown = e => {
        if (!this.currentDoc) return
        e.preventDefault()
        this.currentDoc.addEventListener('mousemove', this.onMouseMove)
        this.currentDoc.addEventListener('mouseup', this.onDragStopped)
        this.saveContainerPosition()
        this.onDragStart(this.getMousePoint(e))
    }

    onMouseMove = e => this.onDrag(this.getMousePoint(e))

    onScroll = e => {
        e.preventDefault()
        this.saveContainerPosition()
    }

    onTouchStart = e => {
        if (!this.currentDoc) return
        this.isTouching = true
        if (this.props.onTouchRequest && !this.props.onTouchRequest(e)) return

        this.currentDoc.addEventListener('touchmove', this.onTouchMove, {
            passive: false,
        })
        this.currentDoc.addEventListener('touchend', this.onDragStopped)
        this.saveContainerPosition()

        if (e.touches.length === 2) {
            this.onPinchStart(e)
        } else if (e.touches.length === 1) {
            this.onDragStart(this.getTouchPoint(e.touches[0]))
        }
    }

    onTouchMove = e => {
        e.preventDefault()
        if (e.touches.length === 2) {
            this.onPinchMove(e)
        } else if (e.touches.length === 1) {
            this.onDrag(this.getTouchPoint(e.touches[0]))
        }
    }

    onGestureStart = e => {
        if (!this.currentDoc) return
        e.preventDefault()
        this.currentDoc.addEventListener('gesturechange', this.onGestureMove)
        this.currentDoc.addEventListener('gestureend', this.onGestureEnd)
        this.gestureZoomStart = this.props.zoom
        this.gestureRotationStart = this.props.rotation
    }

    onGestureMove = e => {
        e.preventDefault()
        if (this.isTouching) return

        const point = this.getMousePoint(e)
        const newZoom = this.gestureZoomStart - 1 + e.scale
        this.setNewZoom(newZoom, point, { shouldUpdatePosition: true })
        if (this.props.onRotationChange) {
            this.props.onRotationChange(this.gestureRotationStart + e.rotation)
        }
    }

    onGestureEnd = e => {
        this.cleanEvents()
    }

    onDragStart = ({ x, y }) => {
        this.dragStartPosition = { x, y }
        this.dragStartCrop = { ...this.props.crop }
        this.props.onInteractionStart?.()
    }

    onDrag = ({ x, y }) => {
        if (!this.currentWindow) return
        if (this.rafDragTimeout)
            this.currentWindow.cancelAnimationFrame(this.rafDragTimeout)

        this.rafDragTimeout = this.currentWindow.requestAnimationFrame(() => {
            if (!this.state.cropSize || x === undefined || y === undefined)
                return
            const offsetX = x - this.dragStartPosition.x
            const offsetY = y - this.dragStartPosition.y
            const requestedPosition = {
                x: this.dragStartCrop.x + offsetX,
                y: this.dragStartCrop.y + offsetY,
            }

            const newPosition = this.props.restrictPosition
                ? restrictPosition(
                      requestedPosition,
                      this.mediaSize,
                      this.state.cropSize,
                      this.props.zoom,
                      this.props.rotation
                  )
                : requestedPosition
            this.props.onCropChange(newPosition)
        })
    }

    onDragStopped = () => {
        this.isTouching = false
        this.cleanEvents()
        this.emitCropData()
        this.props.onInteractionEnd?.()
    }

    onPinchStart = e => {
        const pointA = this.getTouchPoint(e.touches[0])
        const pointB = this.getTouchPoint(e.touches[1])
        this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB)
        this.lastPinchRotation = getRotationBetweenPoints(pointA, pointB)
        this.onDragStart(getCenter(pointA, pointB))
    }

    onPinchMove = e => {
        if (!this.currentDoc || !this.currentWindow) return
        const pointA = this.getTouchPoint(e.touches[0])
        const pointB = this.getTouchPoint(e.touches[1])
        const center = getCenter(pointA, pointB)
        this.onDrag(center)

        if (this.rafPinchTimeout)
            this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout)
        this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(() => {
            const distance = getDistanceBetweenPoints(pointA, pointB)
            const newZoom =
                this.props.zoom * (distance / this.lastPinchDistance)
            this.setNewZoom(newZoom, center, { shouldUpdatePosition: false })
            this.lastPinchDistance = distance

            const rotation = getRotationBetweenPoints(pointA, pointB)
            const newRotation =
                this.props.rotation + (rotation - this.lastPinchRotation)
            this.props.onRotationChange?.(newRotation)
            this.lastPinchRotation = rotation
        })
    }

    onWheel = e => {
        if (!this.currentWindow) return
        if (this.props.onWheelRequest && !this.props.onWheelRequest(e)) return

        e.preventDefault()
        const point = this.getMousePoint(e)
        const { pixelY } = normalizeWheel(e)
        const newZoom = this.props.zoom - (pixelY * this.props.zoomSpeed) / 200
        this.setNewZoom(newZoom, point, { shouldUpdatePosition: true })

        if (!this.state.hasWheelJustStarted) {
            this.setState({ hasWheelJustStarted: true }, () =>
                this.props.onInteractionStart?.()
            )
        }

        if (this.wheelTimer) clearTimeout(this.wheelTimer)
        this.wheelTimer = this.currentWindow.setTimeout(
            () =>
                this.setState({ hasWheelJustStarted: false }, () =>
                    this.props.onInteractionEnd?.()
                ),
            250
        )
    }

    // ======== CÁC PHƯƠNG THỨC HỖ TRỢ ========
    getMousePoint = e => ({ x: e.clientX, y: e.clientY })
    getTouchPoint = touch => ({ x: touch.clientX, y: touch.clientY })

    getPointOnContainer = ({ x, y }, containerTopLeft) => ({
        x: this.containerRect.width / 2 - (x - containerTopLeft.x),
        y: this.containerRect.height / 2 - (y - containerTopLeft.y),
    })

    getPointOnMedia = ({ x, y }) => ({
        x: (x + this.props.crop.x) / this.props.zoom,
        y: (y + this.props.crop.y) / this.props.zoom,
    })

    setNewZoom = (zoom, point, { shouldUpdatePosition = true } = {}) => {
        if (!this.state.cropSize || !this.props.onZoomChange) return
        const newZoom = clamp(zoom, this.props.minZoom, this.props.maxZoom)

        if (shouldUpdatePosition) {
            const zoomPoint = this.getPointOnContainer(
                point,
                this.containerPosition
            )
            const zoomTarget = this.getPointOnMedia(zoomPoint)
            const requestedPosition = {
                x: zoomTarget.x * newZoom - zoomPoint.x,
                y: zoomTarget.y * newZoom - zoomPoint.y,
            }

            const newPosition = this.props.restrictPosition
                ? restrictPosition(
                      requestedPosition,
                      this.mediaSize,
                      this.state.cropSize,
                      newZoom,
                      this.props.rotation
                  )
                : requestedPosition

            this.props.onCropChange(newPosition)
        }
        this.props.onZoomChange(newZoom)
    }

    getCropData = () => {
        if (!this.state.cropSize) return null
        const restrictedPosition = this.props.restrictPosition
            ? restrictPosition(
                  this.props.crop,
                  this.mediaSize,
                  this.state.cropSize,
                  this.props.zoom,
                  this.props.rotation
              )
            : this.props.crop
        return computeCroppedArea(
            restrictedPosition,
            this.mediaSize,
            this.state.cropSize,
            this.getAspect(),
            this.props.zoom,
            this.props.rotation,
            this.props.restrictPosition
        )
    }

    emitCropData = () => {
        const cropData = this.getCropData()
        if (!cropData) return
        const { croppedAreaPercentages, croppedAreaPixels } = cropData
        this.props.onCropComplete?.(croppedAreaPercentages, croppedAreaPixels)
        this.props.onCropAreaChange?.(croppedAreaPercentages, croppedAreaPixels)
    }

    emitCropAreaChange = () => {
        const cropData = this.getCropData()
        if (!cropData) return
        const { croppedAreaPercentages, croppedAreaPixels } = cropData
        this.props.onCropAreaChange?.(croppedAreaPercentages, croppedAreaPixels)
    }

    recomputeCropPosition = () => {
        if (!this.state.cropSize) return
        const newPosition = this.props.restrictPosition
            ? restrictPosition(
                  this.props.crop,
                  this.mediaSize,
                  this.state.cropSize,
                  this.props.zoom,
                  this.props.rotation
              )
            : this.props.crop
        this.props.onCropChange(newPosition)
        this.emitCropData()
    }

    render() {
        const {
            image,
            video,
            mediaProps,
            cropperProps,
            transform,
            crop: { x, y },
            rotation,
            zoom,
            cropShape,
            showGrid,
            style: { containerStyle, cropAreaStyle, mediaStyle },
            classes: { containerClassName, cropAreaClassName, mediaClassName },
        } = this.props
        const objectFit = this.state.mediaObjectFit ?? this.getObjectFit()

        return (
            <div
                onMouseDown={!this.props.disableTouch && this.onMouseDown} // Vẫn kích hoạt
                onTouchStart={this.onTouchStart}
                ref={el => (this.containerRef = el)}
                data-testid='container'
                style={containerStyle}
                className={classNames(
                    'reactEasyCrop_Container',
                    containerClassName
                )}
            >
                {image ? (
                    <img
                        alt=''
                        className={classNames(
                            'reactEasyCrop_Image',
                            objectFit === 'contain' && 'reactEasyCrop_Contain',
                            objectFit === 'custom' && 'reactEasyCrop_Custom',
                            objectFit === 'horizontal-cover' &&
                                'reactEasyCrop_Cover_Horizontal',
                            objectFit === 'vertical-cover' &&
                                'reactEasyCrop_Cover_Vertical',
                            mediaClassName
                        )}
                        {...mediaProps}
                        src={image}
                        ref={this.imageRef}
                        style={{
                            ...mediaStyle,
                            transform:
                                transform ||
                                `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})`,
                        }}
                        onLoad={this.onMediaLoad}
                    />
                ) : (
                    video && (
                        <video
                            autoPlay
                            playsInline
                            loop
                            muted={true}
                            className={classNames(
                                'reactEasyCrop_Video',
                                objectFit === 'contain' &&
                                    'reactEasyCrop_Contain',
                                objectFit === 'horizontal-cover' &&
                                    'reactEasyCrop_Cover_Horizontal',
                                objectFit === 'vertical-cover' &&
                                    'reactEasyCrop_Cover_Vertical',
                                mediaClassName
                            )}
                            {...mediaProps}
                            ref={this.videoRef}
                            onLoadedMetadata={this.onMediaLoad}
                            style={{
                                ...mediaStyle,
                                transform:
                                    transform ||
                                    `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})`,
                            }}
                            controls={false}
                        >
                            {(Array.isArray(video)
                                ? video
                                : [{ src: video }]
                            ).map(item => (
                                <source key={item.src} {...item} />
                            ))}
                        </video>
                    )
                )}
                {this.state.cropSize && (
                    <div
                        ref={this.cropperRef}
                        style={{
                            ...cropAreaStyle,
                            width: this.state.cropSize.width,
                            height: this.state.cropSize.height,
                        }}
                        tabIndex={0}
                        onKeyDown={this.onKeyDown}
                        onKeyUp={this.onKeyUp}
                        data-testid='cropper'
                        className={classNames(
                            'reactEasyCrop_CropArea',
                            cropShape === 'round' &&
                                'reactEasyCrop_CropAreaRound',
                            showGrid && 'reactEasyCrop_CropAreaGrid',
                            cropAreaClassName
                        )}
                        {...cropperProps}
                    />
                )}
            </div>
        )
    }
}

export default Cropper
