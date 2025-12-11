import React from 'react';
import { Card, Radio } from 'antd';

const NhanHang = ({ onShippingMethodChange }) => {
    const handleRadioChange = (e) => {
        const method = e.target.value;
        onShippingMethodChange(method);
    };

    return (
        <Card title="Nhận Hàng" style={{marginTop: '40px'}}>
            <div>
                <Radio.Group onChange={handleRadioChange} defaultValue="store">
                    <Radio value="store">Tại quầy</Radio>
                    <p style={{ padding: '4px', marginLeft: '10px' }}>
                        Nhận hàng tại quầy từ 7-30 đến 19h mỗi ngày tại cửa hàng
                    </p>

                </Radio.Group>
            </div>
        </Card>
    );
};

export default NhanHang;
