export const shareToFacebook = url => {
    window.FB.ui(
        {
            method: 'share',
            href: url,
        },
        function (response) {
            if (response && !response.error_message) {
                alert('Chia sẻ thành công lên Facebook!')
            } else {
                alert('Đã có lỗi xảy ra khi chia sẻ lên Facebook.')
            }
        }
    )
}

export const shareToInstagram = url => {
    window.open(`https://www.instagram.com/?url=${url}`, '_blank')
}

export const shareToThreads = url => {
    window.open(`https://www.threads.net/share?url=${url}`, '_blank')
}
