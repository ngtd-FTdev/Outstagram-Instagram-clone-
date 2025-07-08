
export const generateVideoSnapshots = async (
    videoUrl,
    duration,
    numSnapshots = 5
) => {
    const snapshots = []
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const video = document.createElement('video')
    video.src = videoUrl

    await new Promise(resolve => {
        video.addEventListener('loadeddata', resolve, { once: true })
    })

    canvas.width = 320
    canvas.height = 180

    for (let i = 0; i < numSnapshots; i++) {
        const timePoint = (duration / numSnapshots) * i
        video.currentTime = timePoint
        await new Promise(resolve => {
            video.addEventListener('seeked', resolve, { once: true })
        })
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert to Blob instead of Data URL
        const snapshot = await new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob)
            }, 'image/jpeg')
        })
        
        snapshots.push({ src: snapshot, timePoint })
    }

    return snapshots
}

export const getThumbnailAtTime = async (videoUrl, timePoint) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.src = videoUrl;

    await new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', () => reject(new Error('Không thể tải video')), { once: true });
    });

    const duration = video.duration;
    if (timePoint < 0 || timePoint > duration) {
        throw new Error(`Thời điểm phải nằm trong khoảng 0 đến ${duration}`);
    }

    const width = video.videoWidth || 320;
    const height = video.videoHeight || 180;
    canvas.width = width;
    canvas.height = height;

    video.currentTime = timePoint;
    await new Promise((resolve, reject) => {
        video.addEventListener('seeked', resolve, { once: true });
        video.addEventListener('error', () => reject(new Error('Không thể di chuyển đến thời điểm')), { once: true });
    });

    ctx.drawImage(video, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg');
};

export const getVideoMetadata = videoFile => {
    return new Promise(resolve => {
        const videoUrl = URL.createObjectURL(videoFile)
        const video = document.createElement('video')

        video.onloadedmetadata = () => {
            const duration = Math.min(video.duration, 60)
            URL.revokeObjectURL(videoUrl)
            resolve({
                duration,
                width: video.videoWidth,
                height: video.videoHeight,
            })
        }

        video.src = videoUrl
    })
}

export const formatTimeDisplay = time => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
