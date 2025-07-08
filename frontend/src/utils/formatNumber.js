function formatNumber(num) {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(num)
}

export default formatNumber
