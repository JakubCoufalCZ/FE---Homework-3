import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus, faList, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const ShoppingList = ({ listName, listOwner, items, onAddItem, onQuantityPlus, onQuantityMinus, onToggleComplete}) => {
  const [isToggled, setIsToggled] = useState(true);
  const [localInputValue, setLocalInputValue] = useState(''); // Rename to localInputValue
  const [inputValueList, setInputValueList] = useState('');
  const totalItemCount = items.reduce((total, item) => (!item.isSelected ? total + item.quantity : total), 0);
  const handleChangeViewCompleted = () => {
    setIsToggled(!isToggled);
  };

  const handleAddItem = () => {
    if (localInputValue.trim() !== '') {
      onAddItem(localInputValue); // Pass localInputValue to onAddItem
      setLocalInputValue(''); // Reset localInputValue after adding item
    }
  };

  const handleQuantityPlus = (itemIndex) => {
    onQuantityPlus(itemIndex);
  };

  const handleQuantityMinus = (itemIndex) => {
    onQuantityMinus(itemIndex);
  };

  const toggleComplete = (itemIndex) => {
    onToggleComplete(itemIndex);
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
          <span>{listName}</span>
          <span className='owner'>
            <FontAwesomeIcon icon={faUser} />
            {listOwner}
          </span>
        </div>
      </div>
      <div className='add-item-box'>
        <input
          value={localInputValue}
          onChange={(event) => setLocalInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAddItem();
            }
          }}
          className='add-item-input'
          placeholder='Přidat položku...'
        />
        <FontAwesomeIcon icon={faPlus} onClick={handleAddItem} />
      </div>
      <div className='item-list'>
        {getFilteredItems().map((item, index) => (
          <div className='item-container' key={index}>
            <div className='item-name' onClick={() => toggleComplete(index)}>
              {item.isSelected ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
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
              <span>{item.quantity}</span>
              <button>
                <FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityPlus(index)} />
              </button>
            </div>
          </div>
        ))}
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked={isToggled} onChange={handleChangeViewCompleted} />} label='Zobrazit splněné' />
        </FormGroup>
        <div className='total'>Total: {totalItemCount}</div>
      </div>
    </div>
  );
};

export default ShoppingList;
