import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus, faList, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alignProperty } from '@mui/material/styles/cssUtils';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';



const ShoppingList = ({ listName, listOwner }) => {

    const [isToggled, setIsToggled] = useState(true);
    const [items, setItems] = useState([]);

    const displayCompleted = true;
    //input const na přidávání položek
    const [inputValue, setInputValue] = useState('');
    const [inputValueList, setInputValueList] = useState('');

    const [totalItemCount, setTotalItemCount] = useState(0);

    const handleChangeViewCompleted = () => {
        setIsToggled(!isToggled);
    };


    //Handle AddItem
    const handleAddItem = () => {
        const newItem = {
            itemName: inputValue,
            quantity: 1,
            isSelected: false,
        }

        const newItems = [...items, newItem];

        setItems(prevItems => [...prevItems, newItem]);

        setInputValue('');

        // Manually increment totalItemCount by 1
        setTotalItemCount(prevTotalItemCount => prevTotalItemCount + 1);

    };

    //Handle pridat pocet - Prijme parametr Index aby jsme vedeli jaky item ma pridat quantity
    const handleQuantityPlus = (index) => {
        const newItems = [...items];

        newItems[index].quantity++;

        setItems(newItems);
        calculateTotal();
    }

    //handle odebrat pocet
    const handleQuantityMinus = (index) => {
        const newItems = [...items];
        if (newItems[index].quantity == 1) {
            newItems.splice(index, 1);
            setItems(newItems);
            // Manually decrease totalItemCount by 1
            setTotalItemCount(prevTotalItemCount => prevTotalItemCount - 1);
            calculateTotal();
        }
        else {
            newItems[index].quantity--;
            setItems(newItems);
            calculateTotal();
        };
    };

    const toggleComplete = (index) => {
        const newItems = [...items];
        newItems[index].isSelected = !newItems[index].isSelected;
        setItems(newItems);
        calculateTotal();
    };

    //Spocitat total
    const calculateTotal = () => {
        const totalItemCount = items.reduce((total, item) => {
            if (!item.isSelected) {
                return total + item.quantity;
            }
            return total;
        }, 0);
        setTotalItemCount(totalItemCount);
        console.log(totalItemCount);
    };

    const getFilteredItems = () => {
        if (!isToggled) {
            return items.filter((item) => !item.isSelected); // Show non-completed items
        } else {
            return items; // Show all items
        }
    };

    return (
        
        <div className='main-container'>
            <div>
                <div className='owner-and-name'>
                    <span>
                        {listName}
                    </span>
                    <span className='owner'>
                        <FontAwesomeIcon icon={faUser} />
                        {listOwner}

                    </span>
                </div>
            </div>
            <div className='add-item-box'>
                <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleAddItem();
                        }
                    }}
                    className='add-item-input'
                    placeholder='Přidat položku...'
                />

                <FontAwesomeIcon icon={faPlus} onClick={() => handleAddItem()} /> {/* Ikona symbolu plus */}
            </div>
            <div className='item-list'>
                {getFilteredItems().map((item, index) => <div className='item-container'>
                    <div className='item-name' onClick={() => toggleComplete(index)}>
                        {item.isSelected ? (
                            <>
                                <FontAwesomeIcon icon={faCheckCircle} /> {/* Ikona checkboxu */}
                                <span className='completed'>{item.itemName}</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCircle} />
                                <span>{item.itemName}</span>
                            </>
                        )}
                    </div>
                    <div className='quantity'>
                        <button>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => handleQuantityMinus(index)} />
                        </button>
                        <span> {item.quantity} </span>
                        <button>
                            <FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityPlus(index)} />
                        </button>
                    </div>
                </div>)}
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked={isToggled} onChange={() => handleChangeViewCompleted()} />} label="Zobrazit splněné" />
                </FormGroup>
                <div className='total'>
                    Total: {totalItemCount}</div>
            </div>
        </div>

    );
};

export default ShoppingList;