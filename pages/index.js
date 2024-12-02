import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ShoppingApp.module.css';

export default function ShoppingApp() {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedItemName, setSelectedItemName] = useState('');
    const [selectedItemAmount, setSelectedItemAmount] = useState(1);

    // Fetch all shopping items on initial render
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(process.env.API_URL || '/api/shopping');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    // Add an item to the cart
    const addToCart = (item, amount) => {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        const availableAmount = item.amount;
        const desiredAmount = existingItem ? existingItem.amount + amount : amount;

        if (desiredAmount > availableAmount) {
            alert(`You cannot add more than ${availableAmount} of ${item.name} to the cart.`);
            return;
        }

        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.name === item.name ? { ...cartItem, amount: cartItem.amount + amount } : cartItem
            ));
        } else {
            setCart([...cart, { ...item, amount: amount }]);
        }
    };

    // Remove an item from the cart
    const removeFromCart = (name) => {
        const itemInCart = cart.find(cartItem => cartItem.name === name);
        if (itemInCart) {
            const updatedCart = cart.filter(cartItem => cartItem.name !== name);
            setCart(updatedCart);
        }
    };

    // Add a new item to the shopping list
    const addItem = async () => {
        if (!selectedItemName) return;
        const newItem = { name: selectedItemName, amount: selectedItemAmount };

        try {
            const response = await axios.post(process.env.API_URL || '/api/shopping', newItem);
            setItems([...items, response.data]);
            setSelectedItemName('');
            setSelectedItemAmount(1);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Update an item in the shopping list
    const updateItem = async (name, updatedAmount) => {
        try {
            const response = await axios.put(`${process.env.API_URL || '/api/shopping'}/${name}`, { amount: updatedAmount });
            if (response.status === 200) {
                setItems(items.map(item =>
                    item.name === name ? { ...item, amount: updatedAmount } : item
                ));
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    // Delete an item from the shopping list
    const deleteItem = async (name) => {
        try {
            await axios.delete(`${process.env.API_URL || '/api/shopping'}/${name}`);
            setItems(items.filter(item => item.name !== name));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Shopping List</h1>
            <div className={styles.itemsGrid}>
                {items.map((item) => {
                    const existingItemInCart = cart.find(cartItem => cartItem.name === item.name);
                    const addButtonDisabled = existingItemInCart && existingItemInCart.amount >= item.amount;
                    return (
                        <div key={item.name} className={styles.itemCard}>
                            <div className={styles.itemDetails}>
                                <h2 className={styles.itemName}>{item.name}</h2>
                                <p className={styles.itemAmount}>Available Quantity: {item.amount}</p>
                                <input
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    className={styles.input}
                                    onChange={(e) => item.selectedAmount = parseInt(e.target.value)}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={() => addToCart(item, item.selectedAmount || 1)}
                                    className={styles.addButton}
                                    disabled={addButtonDisabled}
                                >
                                    {addButtonDisabled ? 'Max Reached' : 'Add to Cart'}
                                </button>
                                <button onClick={() => deleteItem(item.name)} className={styles.deleteButton}>
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.cartContainer}>
                <h2 className={styles.cartTitle}>Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p className={styles.emptyCart}>Your cart is empty</p>
                ) : (
                    <ul className={styles.cartList}>
                        {cart.map((item) => (
                            <li key={item.name} className={styles.cartItem}>
                                <span>{item.name} - {item.amount}</span>
                                <button onClick={() => removeFromCart(item.name)} className={styles.deleteButton}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.addItemContainerBottomRight}>
                <input
                    type="text"
                    placeholder="Item name"
                    value={selectedItemName}
                    onChange={(e) => setSelectedItemName(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="number"
                    min="1"
                    value={selectedItemAmount}
                    onChange={(e) => setSelectedItemAmount(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addItem} className={styles.addButton}>Add Item</button>
            </div>
        </div>
    );
}