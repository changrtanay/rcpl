const currencyFormat = (no) => {
    const format = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    })

    return format.format(no)
}

export default currencyFormat