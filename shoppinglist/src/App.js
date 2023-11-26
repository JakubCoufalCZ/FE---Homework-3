import React, { useState, useEffect } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ShoppingList from './ShoppingList';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const App = ({ }) => {

  const [isToggled, setIsToggled] = useState(true);

  const [items, setItems] = useState([
    { listName: 'MyList1', listOwner: 'You' },
  ]);

  const displayCompleted = true;
  //input const na přidávání položek
  const [inputValue, setInputValue] = useState('');
  const [inputValueList, setInputValueList] = useState('');

  const [totalItemCount, setTotalItemCount] = useState(3);

  const handleChangeViewCompleted = () => {
    setIsToggled(!isToggled);
  };



  //Handle AddItem
  const handleAddItem = () => {
    const newItem = {
      listName: inputValue,
      listOwner: "You"
    }
    if (!newItem.listName) {
      newItem.listName = "My new list"
    }
    const newItems = [...items, newItem];

    setItems(newItems);

    setInputValue('');

    // Manually increment totalItemCount by 1
    setTotalItemCount(prevTotalItemCount => prevTotalItemCount + 1);

    //Pro animaci

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
    newItems.splice(index, 1);
    setItems(newItems);

  };

  //Spocitat total
  const calculateTotal = () => {
    const totalItemCount = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setTotalItemCount(totalItemCount);
  };

  const handleEditListName = (index) => {
    console.log("EDIT");
    const newItems = [...items];
    newItems[index].listName = inputValueList;
    setItems(newItems);
  };


  return (
    <div className='app-background'>
      <div className='main-container'>
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
            placeholder='Přidat list...'
          />
          <FontAwesomeIcon icon={faPlus} onClick={() => handleAddItem()} />
        </div>
        <div className='item-list'>
          <TransitionGroup>
            {items.map((item, index) => (
              <CSSTransition key={index} timeout={500} classNames="item">
                <div className='item-container'>
                  <div className='item-name'>
                    <span>
                      <input
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleEditListName(index);
                          }
                        }}
                        onChange={(event) => setInputValueList(event.target.value)}
                        className="change-list-name"
                        placeholder={item.listName}
                      />
                    </span>
                  </div>
                  <div>
                    <button>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="beat-animation"
                        onClick={() => handleQuantityMinus(index)}
                      />
                    </button>
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
      <div id='01' className="shopping-list-container">
        <TransitionGroup className="shopping-list-container">
          {items.map((item, index) => (
            <CSSTransition key={index} timeout={500} classNames="item">
              <ShoppingList key={index} listName={item.listName} listOwner={item.listOwner} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default App;