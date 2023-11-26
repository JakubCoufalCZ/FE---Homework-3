import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ShoppingList from './ShoppingList';

const App = () => {
  const [data, setData] = useState({
    lists: [
      { listName: 'MyList1', listOwner: 'You', items: [] }, //Jako v ukolu na BE
    ],
  });

  const [totalItemCount, setTotalItemCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [inputValueList, setInputValueList] = useState('');

  const handleAddItem = (listIndex, inputValue) => {
    const newItem = {
      itemName: inputValue,
      quantity: 1,
      isSelected: false,
    };

    setData((prevData) => {
      const newLists = [...prevData.lists];
      newLists[listIndex].items = [...newLists[listIndex].items, newItem];

      return { lists: newLists };
    });

    calculateTotal();
  };
//Prida pocet v konkretnim listu a u konkretniho item indexu
  const handleQuantityPlus = (listIndex, itemIndex) => {
    setData((prevData) => {
      const newLists = [...prevData.lists];
      const newItems = [...newLists[listIndex].items];
      newItems[itemIndex].quantity++;
      newLists[listIndex].items = newItems;

      return { lists: newLists };
    });

    calculateTotal(); //Update total count
  };

  const handleQuantityMinus = (listIndex, itemIndex) => {
    setData((prevData) => {
      const newLists = [...prevData.lists];
      const newItems = [...newLists[listIndex].items];

      if (newItems[itemIndex].quantity > 1) {
        newItems[itemIndex].quantity--;
      } else {
        newItems.splice(itemIndex, 1);
      }

      newLists[listIndex].items = newItems;

      return { lists: newLists };
    });

    calculateTotal();
  };

  const removeList = (listIndex) => {
    setData((prevData) => {
      const newLists = [...prevData.lists];
      newLists.splice(listIndex, 1);
      return { lists: newLists };
    });
  };

  const calculateTotal = () => {
    const totalItemCount = data.lists.reduce((total, list) => {
      return total + list.items.reduce((listTotal, item) => (item.isSelected ? listTotal + item.quantity : listTotal), 0);
    }, 0);
    setTotalItemCount(totalItemCount);
  };
  //Pridat novy list
  const addNewShoppingList = () => {
    const newList = { listName: inputValue, listOwner: 'You', items: [] };
    setData((prevData) => ({ lists: [...prevData.lists, newList] }));
    setInputValue('');
  };
//pro editaci listu
  const handleEditListName = (listIndex) => {
    setData((prevData) => {
      const newLists = [...prevData.lists];
      newLists[listIndex].listName = inputValueList;
      return { lists: newLists };
    });
  };
  const handleToggleComplete = (listIndex, itemIndex) => {
    setData((prevData) => {
      const newLists = [...prevData.lists];
      newLists[listIndex].items[itemIndex].isSelected = !newLists[listIndex].items[itemIndex].isSelected;
      return { lists: newLists };
    });
  };

  useEffect(() => {
    calculateTotal();
  }, [data.lists]);

  return (
    <Router>
      <div className='app-background'>
        <div className='main-container'>
          <div className='add-item-box'>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  addNewShoppingList();
                }
              }}
              className='add-item-input'
              placeholder='Přidat list...'
            />
            <FontAwesomeIcon icon={faPlus} onClick={addNewShoppingList} />
          </div>
          <div className='item-list'>
            <TransitionGroup>
              {data.lists.map((list, listIndex) => (
                <CSSTransition key={listIndex} timeout={500} classNames="item">
                  <div className='item-container'>
                    <div className='item-name'>
                      <span>
                        <input
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleEditListName(listIndex);
                            }
                          }}
                          onChange={(event) => setInputValueList(event.target.value)}
                          className="change-list-name"
                          placeholder={list.listName}
                        />
                      </span>
                    </div>
                    <Link to={`/shopping-list/${listIndex}`}>
                      <FontAwesomeIcon icon={faInfoCircle}/>
                    </Link>
                    <div>
                      <button>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="beat-animation"
                          onClick={() => removeList(listIndex)}
                        />
                      </button>
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        </div>
        <Routes>
          {data.lists.map((list, listIndex) => (
            <Route
              key={listIndex}
              path={`/shopping-list/${listIndex}`}
              element={
                <ShoppingList
                  listName={list.listName}
                  listOwner={list.listOwner}
                  items={list.items}
                  onAddItem={(inputValue) => handleAddItem(listIndex, inputValue)}
                  onQuantityPlus={(itemIndex) => handleQuantityPlus(listIndex, itemIndex)}
                  onQuantityMinus={(itemIndex) => handleQuantityMinus(listIndex, itemIndex)}
                  onToggleComplete={(itemIndex) => handleToggleComplete(listIndex, itemIndex)}
                />
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
