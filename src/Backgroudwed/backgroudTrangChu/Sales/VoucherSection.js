import React, { useEffect, useState } from "react";
import { getAllVoucherUser } from "../../../api/VoucherApi";
import moment from "moment";
import { message, Button } from "antd";

const VoucherSection = ({ total, setDiscount, setVoucherId }) => {
    const [vouchers, setVouchers] = useState([]); // Danh sách voucher từ API
    const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher được chọn
    const [showAll, setShowAll] = useState(false); // Trạng thái hiển thị tất cả hoặc rút gọn

    useEffect(() => {
        async function fetchVouchers() {
            try {
                const response = await getAllVoucherUser();
                const activeVouchers = response.data;
                setVouchers(activeVouchers);
            } catch (error) {
                console.error("Failed to fetch vouchers:", error);
            }
        }
        fetchVouchers();
    }, []);
    useEffect(() => {
        if (selectedVoucher) {
            const isVoucherStillValid =
                total >= selectedVoucher.minTotal &&
                moment().isBetween(moment(selectedVoucher.startDate), moment(selectedVoucher.endDate), 'day', '[]');

            if (!isVoucherStillValid) {
                setSelectedVoucher(null);
                setDiscount(0);
                setVoucherId(null);
                message.warning("Voucher đã bị hủy do không còn hợp lệ với giỏ hàng.");
            }
        }
    }, [total, selectedVoucher]);

    // useEffect(() => {
    //     if (total === 0) {
    //         setSelectedVoucher(null);
    //         setDiscount(0);
    //         setVoucherId(null);
    //         message.info("Giỏ hàng trống, voucher đã bị hủy.");
    //     }
    // }, [total]);
    // Lọc các voucher hợp lệ dựa trên trạng thái, số lượng, và ngày
    const validVouchers = vouchers.filter(voucher => {
        const isWithinDateRange =
            moment().isBetween(moment(voucher.startDate), moment(voucher.endDate), 'day', '[]');
        const isWithinUsageLimit = voucher.usage < voucher.maxUsage;
        const isActive = voucher.status === "ACTIVE";
        const isMoneyType = voucher.type === "money";
        const isPrecentType = voucher.type === "percent";
        return isWithinDateRange && isWithinUsageLimit && isActive && (isMoneyType || isPrecentType);

    });

    // Sắp xếp voucher theo giá trị giảm giảm dần
    const sortedVouchers = validVouchers.sort((a, b) => {
        const discountA =
            a.type === "percent"
                ? Math.min((total * a.discount) / 100, a.maxDiscount)
                : a.discount;
        const discountB =
            b.type === "percent"
                ? Math.min((total * b.discount) / 100, b.maxDiscount)
                : b.discount;

        return discountB - discountA; // Sắp xếp giảm dần
    });

    // Xác định danh sách voucher hiển thị (2 giảm nhiều nhất hoặc tất cả)
    const displayedVouchers = showAll ? sortedVouchers : sortedVouchers.slice(0, 2);
    const handleDeselectVoucher = () => {
        setSelectedVoucher(null); // Xóa voucher được chọn
        setDiscount(0); // Reset giảm giá về 0
        setVoucherId(null); // Xóa ID voucher
        message.info("Bạn đã bỏ chọn voucher."); // Hiển thị thông báo
    };

    const handleSelectVoucher = (voucher) => {
        let discountAmount = 0;

        // Tính số tiền giảm dựa trên loại voucher
        if (voucher.type === "percent" && total >= voucher.minTotal) {
            discountAmount = Math.min((total * voucher.discount) / 100, voucher.maxDiscount);
        } else if (total >= voucher.minTotal) {
            discountAmount = voucher.discount; // Chỉ tính nếu đủ điều kiện
        } else {
            message.error(
                `Đơn hàng chưa đạt mức tối thiểu ${voucher.minTotal.toLocaleString()} VND để áp dụng voucher này!`
        );
            return;
        }

        setSelectedVoucher(voucher); // Lưu voucher được chọn
        setDiscount(discountAmount); // Cập nhật số tiền giảm giá
        setVoucherId(voucher.id); // Lưu ID voucher
        message.success(`Đã chọn voucher "${voucher.name}" với mức giảm ${discountAmount.toLocaleString()} VND!`);
    };

    return (
        <div className="voucher-section">
            <h3>Danh sách Voucher</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {displayedVouchers.map(voucher => {
                    const isDisabled =
                        (voucher.type === "money" || voucher.type === "percent") && total < voucher.minTotal;

                    // Tính số tiền còn thiếu (chỉ áp dụng với voucher giảm tiền mặt)
                    const remainingAmount =
                        total < voucher.minTotal ? voucher.minTotal - total : 0;
                        // voucher.type === "money" && total < voucher.minTotal
                        //     ? voucher.minTotal - total
                        //     : 0;

                    return (
                        <div
                            key={voucher.id}
                            onClick={() => !isDisabled && handleSelectVoucher(voucher)} // Không cho click nếu disabled
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                backgroundColor: selectedVoucher?.id === voucher.id ? "#f0f8ff" : isDisabled ? "#f5f5f5" : "#fff",
                                cursor: isDisabled ? "not-allowed" : "pointer", // Thay đổi con trỏ chuột
                                opacity: isDisabled ? 0.6 : 1, // Giảm độ sáng nếu disabled
                                transition: "all 0.3s ease",
                            }}
                        >
                            {/* Thông tin voucher */}
                            <div>
                                <h4 style={{ margin: "0 0 5px" }}>{voucher.name}</h4>
                                <p style={{ margin: "0", fontSize: "14px" }}>
                                    Hạn đến: {voucher.endDate ? new Date(voucher.endDate).toLocaleString() : "Không xác định"}
                                </p>
                                <p style={{ margin: "0", fontSize: "14px" }}>
                                     Áp dụng cho đơn hàng từ {voucher.minTotal?.toLocaleString() || "0"} VND
                                </p>
                                <p style={{ margin: "0", fontSize: "14px" }}>
                                    Giảm: {voucher.type === "percent"
                                    ? `${voucher.discount}% (tối đa ${voucher.maxDiscount?.toLocaleString()} VND)`
                                    : `${voucher.discount?.toLocaleString() || "0"} VND`}
                                </p>
                                <p style={{ margin: "0", fontSize: "14px" }}>
                                    Số lượng: {voucher.maxUsage - voucher.usage || 0}
                                </p>
                                {remainingAmount > 0 && (
                                    <span style={{ color: "red", fontSize: "12px" }}>
        {voucher.type === "money"
            ? `* Cần thêm ${remainingAmount.toLocaleString()} VND để áp dụng voucher này`
            : `* Cần thêm ${remainingAmount.toLocaleString()} VND để áp dụng voucher này `}
    </span>
                                )}
                                {/*{remainingAmount > 0 && (*/}
                                {/*    <span style={{ color: "red", fontSize: "12px" }}>*/}
                                {/*        * Cần thêm {remainingAmount.toLocaleString()} VND để áp dụng voucher này*/}
                                {/*    </span>*/}
                                {/*)}*/}
                            </div>
                            {selectedVoucher?.id === voucher.id && (
                                <span style={{ color: "green", fontWeight: "bold" }}>Đã chọn</span>
                            )}
                        </div>
                    );
                })}

                {/* Hiển thị nếu không có voucher hợp lệ */}
                {validVouchers.length === 0 && <p>Không có voucher hợp lệ để áp dụng.</p>}
            </div>
            {selectedVoucher && (
                <Button
                    onClick={handleDeselectVoucher}
                    style={{
                        marginTop: "15px",
                        alignSelf: "center",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        borderColor: "#ff4d4f",
                    }}
                >
                    Bỏ chọn voucher
                </Button>
            )}
            {/* Nút chuyển đổi giữa tất cả và rút gọn */}
            <Button
                onClick={() => setShowAll(!showAll)}
                style={{ marginTop: "15px", alignSelf: "center" }}
            >
                {showAll ? "Rút gọn" : "Tất cả"}
            </Button>
        </div>
    );
};

export default VoucherSection;
