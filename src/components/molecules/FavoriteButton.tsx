import React,{ useCallback } from 'react'
import { FaStar } from "react-icons/fa6"
import { FaRegStar } from "react-icons/fa6"

type FavoriteButtonProps = {
  isFavorite: boolean | undefined
  onClick: () => void
  count: number | undefined
  disabled: boolean
}

const FavoriteButton = React.memo(({ isFavorite, onClick, count,disabled }: FavoriteButtonProps) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick() 
    }
  }, [onClick, disabled]) 
  return (
  <>
    <button
      className="inline-flex space-x-2 items-center cursor-pointer"
      onClick={handleClick}
      disabled={disabled}
    >
    {isFavorite === undefined ? (
      <p>loading now</p>
        ) : isFavorite ? (
          <FaStar className="text-yellow-500" size={20} />
        ) : (
          <FaRegStar className="text-gray-500" size={20} />
        )}
      </button>
      {count !== undefined && (
        <>
          <span>いいね</span>
          <span>{count !== undefined ? Math.max(count, 0) : '...'}</span>
        </>
      )}
    </>
  )
})

FavoriteButton.displayName ="FavoriteButton"
export default FavoriteButton