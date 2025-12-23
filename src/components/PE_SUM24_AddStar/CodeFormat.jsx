import React from 'react'

function CodeFormat() {
    // Format ngày tháng năm
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format danh sách genres thành chuỗi
    const formatGenres = (genres) => {
        return genres.join(', ');
    };

    // Tính tổng chi phí từ danh sách giá
    const calculateTotal = (prices) => {
        return prices.reduce((total, price) => total + price, 0);
    };

    // Tính tổng chi phí từ danh sách item với số lượng
    const calculateTotalWithQuantity = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Tính VAT cho tổng giá trị
    const calculateVAT = (total, vatRate = 10) => {
        return (total * vatRate) / 100;
    };

    // Tính tổng chi phí bao gồm VAT
    const calculateTotalWithVAT = (total, vatRate = 10) => {
        return total + calculateVAT(total, vatRate);
    };

    // Tính giảm giá theo phần trăm
    const calculateDiscount = (total, discountRate) => {
        return (total * discountRate) / 100;
    };

    // Tính tổng sau khi áp dụng giảm giá
    const calculateTotalAfterDiscount = (total, discountRate) => {
        return total - calculateDiscount(total, discountRate);
    };

    return (
        <div>

        </div>
    )
}

export default CodeFormat
