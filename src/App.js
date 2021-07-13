import React from 'react';
import {Route} from 'react-router-dom';
import axios from 'axios'

import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';

const App = () => {
  const [items, setItems] = React.useState([])
  const [cartItems, setCartItems] = React.useState([])
  const [favorites, setFavorites] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [cartOpened, setCartOpened] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemResponse] = await Promise.all([axios.get('https://60d43ab061160900173ca973.mockapi.io/cart'), axios.get('https://60d43ab061160900173ca973.mockapi.io/favorites'), axios.get('https://60d43ab061160900173ca973.mockapi.io/items')])
  
        setIsLoading(false)
  
        setCartItems(cartResponse.data)
        setFavorites(favoritesResponse.data)
        setItems(itemResponse.data)
      } catch (error) {
        alert('Ощибки при запросе данных :(')
      }
    }
    
    fetchData()
  }, [])
  
  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(item => +item.parentId === +obj.id)
      if (findItem) {
        setCartItems(prev => prev.filter(item => +item.parentId !== +obj.id))
        await axios.delete(`https://60d43ab061160900173ca973.mockapi.io/cart/${findItem.id}`)
      } else {
        setCartItems(prev => [...prev, obj])
        const {data} = await axios.post('https://60d43ab061160900173ca973.mockapi.io/cart', obj)
        setCartItems(prev => prev.map(item => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          }
          return item
        }))
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину')
      console.error(error)
    }
  }

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://60d43ab061160900173ca973.mockapi.io/cart/${id}`)
      setCartItems(prev => prev.filter(item => +item.id !== +id))
    } catch (error) {
      alert('Ошибка при удалении из корзины')
      console.error(error)
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(favObj => +favObj.id === +obj.id)) {
        axios.delete(`https://60d43ab061160900173ca973.mockapi.io/favorites/${obj.id}`)
        setFavorites(prev => prev.filter(item => +item.id !== +obj.id))
      } else {
        const {data} = await axios.post('https://60d43ab061160900173ca973.mockapi.io/favorites', obj)
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
      console.error(error)
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => +obj.parentId === +id)
  }

  return (
    <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems}}>
      <div className="wrapper clear">
        <Drawer 
          items={cartItems} 
          closeCart={() => setCartOpened(false)}
          onRemove={onRemoveItem} 
          opened={cartOpened}
        />
        <Header openCart={() => setCartOpened(true)} />

        <Route path="/" exact>
          <Home 
            items={items} 
            cartItems={cartItems}
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToCart={onAddToCart} 
            onAddToFavorite={onAddToFavorite}
            isLoading={isLoading} />
        </Route>

        <Route path="/favorites" exact>
          <Favorites />
        </Route>
        <Route path="/orders" exact>
          <Orders />
        </Route>
      </div>
    </AppContext.Provider>
  );
}

export default App;
