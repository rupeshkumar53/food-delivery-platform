import React from 'react';

function MenuItemCard({ item, onAddToCart }) {
    const vegIcon = item.isVeg ? '🟢' : '🔴';

    return (
        <div style={styles.card}>
            {/* Emoji Box */}
            <div style={styles.imgBox}>
                {item.isVeg ? '🥗' : '🍗'}
            </div>

            <div style={styles.body}>
                <div style={styles.nameRow}>
                    <span style={styles.vegIcon}>
                        {vegIcon}
                    </span>
                    <h3 style={styles.name}>
                        {item.name}
                    </h3>
                </div>

                {item.description && (
                    <p style={styles.desc}>
                        {item.description}
                    </p>
                )}

                <div style={styles.footer}>
                    <span style={styles.price}>
                        ₹{item.price}
                    </span>
                    <button
                        onClick={onAddToCart}
                        style={styles.addBtn}>
                        + Add
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column'
    },
    imgBox: {
        backgroundColor: '#fafafa',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '45px',
        borderBottom: '1px solid #f0f0f0'
    },
    body: {
        padding: '15px'
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px'
    },
    vegIcon: {
        fontSize: '14px'
    },
    name: {
        margin: 0,
        fontSize: '16px',
        color: '#222',
        fontWeight: 'bold'
    },
    desc: {
        color: '#999',
        fontSize: '13px',
        margin: '0 0 12px 0',
        lineHeight: '1.4'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px'
    },
    price: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ff4500'
    },
    addBtn: {
        backgroundColor: '#ff4500',
        color: 'white',
        border: 'none',
        padding: '8px 18px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    }
};

export default MenuItemCard;