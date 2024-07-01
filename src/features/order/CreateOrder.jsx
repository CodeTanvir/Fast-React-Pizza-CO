import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from '../../store'
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );


function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigate = useNavigation();
  const isSubmitting = navigate.state === 'submitting'
  const formErrors = useActionData()
  const {
    username,
    status:addressStatus,
    position,
    address,
    error: errorAddress
  } = useSelector((state)=> state.user);
  const isLoadingAddress = addressStatus === 'loading'
  const dispatch = useDispatch()
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;


  if(!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
    
    <Form method="POST">
      
        <div className="mb-5 flex gap-2 flex-xol sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
        
          {formErrors?.phone && <p className="mt-2 rounded-md bg-red-100
          p-2 text-xs text-red-700">{formErrors.phone}</p>}
        </div>
   </div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input className="input w-full"
             type="text" name="address" 
             disabled={isLoadingAddress}
             defaultValue={address}
             required />
               {addressStatus === 'error' && <p className="mt-2 rounded-md bg-red-100
          p-2 text-xs text-red-700">{errorAddress}</p>}
          </div>
        {!position.latitude && !position.lognitude && (
            <span className="absolute md:right-[3px] z-50 md:top-[3px] "> 
            <Button 
            disabled={isSubmitting || isLoadingAddress}
            type="small" onClick={(e)=> {
               e.preventDefault()
             dispatch(fetchAddress())}}>Get Position</Button>
         </span>
        )}
         
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
          className="h-6 w-6 accent-yellow-400
          focus:outline-none focus:ring
          focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input 
           type="hidden" name="cart" value={JSON.stringify(cart)}/>
            <input 
           type="hidden" name="totalCartPrice" value={JSON.stringify(totalCartPrice)}/>
              <input 
           type="hidden" name="PriorityPrice" value={JSON.stringify(priorityPrice)}/>
              <input 
           type="hidden" name="totalPrice" value={JSON.stringify(totalPrice)}/>
           <input type="hidden" name="position"
            value={ position.longitude && position.latitude ?
             `${position.latitude},${position.longitude}`:``}/>
          <Button disabled={isSubmitting} type='primary'>
          {isSubmitting ? 'Placing order...': `Order Now ${formatCurrency(totalPrice)}`}</Button>
        </div>
     
      </Form>
    </div>
  );
}
export async function action({request}){
  const formData = await request.formData();
  const data = Object.fromEntries(formData)
  
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  }
 

 const errors = {};
 if(!isValidPhone(order.phone))
 
  errors.phone = "Please give us correct phone number. we might need this"
  
  if(Object.keys(errors).length > 0) return errors;


 const newOrder = await createOrder(order);
 store.dispatch(clearCart())
  return redirect(`/order/${newOrder.orderId}`)
  
}
export default CreateOrder;
