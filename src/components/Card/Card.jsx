import React from 'react';
import ContentLoader from "react-content-loader"
import styles from './Card.module.scss'
import AppContext from "../../context";

const Card = ({ 
  id, 
  title, 
  imageUrl, 
  price, 
  addToFavorite, 
  addToCart, 
  favorited = false, 
  loading=false
}) => {

  const { isItemAdded } = React.useContext(AppContext)
  const [isFavorite, setIsFavorite] = React.useState(favorited)
  const obj = {id, parentId: id, title, imageUrl, price}

  const oncClickPlus = () => {
    addToCart(obj)
  }

  const onClickFavorite = () => {
    addToFavorite(obj)
    setIsFavorite(!isFavorite)
  }

  return (
    <div className={styles.card}>
      {
        loading 
        ? <ContentLoader 
          speed={2}
          width={170}
          height={230}
          viewBox="0 0 170 230"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          >
            <rect x="0" y="5" rx="10" ry="10" width="170" height="125" /> 
            <rect x="0" y="145" rx="5" ry="5" width="170" height="15" /> 
            <rect x="0" y="170" rx="5" ry="5" width="100" height="15" /> 
            <rect x="0" y="203" rx="5" ry="5" width="80" height="25" /> 
            <rect x="138" y="198" rx="10" ry="10" width="32" height="32" />
          </ContentLoader>
        :
        <>
          <div className={styles.favorite} onClick={onClickFavorite}>
            {addToFavorite && <img src={isFavorite ? 'img/liked.svg' : 'img/unliked.svg'} alt="Unliked"/>}
          </div>
          <img className={styles.image} width={133} height={112} src={imageUrl} alt="Sneakers"/>
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>
            {addToCart && 
              <img className={styles.plus} 
                onClick={oncClickPlus} 
                src={isItemAdded(id) ? 'img/btn-checked.svg' : 'img/btn-plus.svg'} alt="Plus"/>
            }
          </div>
        </>
      }
    </div>
  )
}

export default Card

