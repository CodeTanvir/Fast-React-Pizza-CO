import { useDispatch } from 'react-redux'
import Button from '../../ui/Button'
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice'

function UpdateItemQuantity({PizzaId, currentQuantity}) {
    const dispatch = useDispatch()
    return (
        <div className='flex gap-2 items-center md:gap-3'>
            <Button type="round" onClick={()=> dispatch(decreaseItemQuantity(PizzaId))}>-</Button>
            <span className='text-sm font-medium'>{currentQuantity}</span>
            <Button type="round" onClick={()=> dispatch(increaseItemQuantity(PizzaId))}>+</Button>
        </div>
    )
}

export default UpdateItemQuantity
