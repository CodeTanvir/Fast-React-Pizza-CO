// Test ID: IIDSAT
import { useFetcher, useLoaderData } from "react-router-dom";
import {getOrder} from "../../services/apiRestaurant"
import OrderItem from "./OrderItem"
import Button from '../../ui/Button'
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate
} from "../../utils/helpers";
import { useEffect, useState } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const [order] = useLoaderData()

const fetcher = useFetcher();

useEffect(function(){
  if(!fetcher.data && fetcher.state === 'idle')
  fetcher.load('/menu');
},[fetcher])

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    orderId,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
    customer,
    address,
    orderTime,
    phone
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);
  const [TimeRanges, setTimeRanges] = useState(deliveryIn);
  const [realstatus, setStatus]= useState(status)
 
useEffect(() => {
  let isMounted = true; // Flag to track component mount status

  const fetchData = async () => {
    try {
      const updatedOrder = await getOrder(order.orderId);
      if (isMounted) {
        setStatus(updatedOrder[0].status);
        setTimeRanges(() => calcMinutesLeft(updatedOrder[0].estimatedDelivery));
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  fetchData(); // Initial fetch

  const intervalId = setInterval(fetchData, 10000); // Polling every 10 seconds

  return () => {
    isMounted = false; // Mark component as unmounted
    clearInterval(intervalId); // Clean up interval
  };
}, [order.orderId, getOrder, calcMinutesLeft]);


     function handlePrint(){
      window.print()
     }

  return (
    <div className="px-4 py-6 space-y-8 scroll-m-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold ">Order #{orderId}</h2>
       
        <div className="space-x-2 ">
          {priority && <span className="rounded-full px-3 py-1 bg-red-500 text-sm font-semibold
          uppercase tracking-wide text-red-50 print:hidden">Priority</span>}
          <span className="rounded-full px-3 py-1 bg-green-500 text-sm font-semibold
          uppercase tracking-wide text-red-50 print:hidden">{realstatus}</span>
           <p className="hidden print:block">{customer}</p>
          <p className="hidden print:block">{address}</p>
          <p className="hidden print:block">phone: {phone}</p>
        </div>
        
      </div>
      <p className="hidden print:block ">Order Time : {formatDate(orderTime)}</p>
      <div className="flex flex-wrap items-center print:hidden
       justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0 || realstatus !== "arrived"
            ? `Only ${TimeRanges} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs print:hidden
         text-stone-500">(Estimated delivery:{formatDate(estimatedDelivery)})</p>
      </div>

            <ul className="dive-stone-200 divide-y border-b border-t">
              {cart.map((item)=>(
                <OrderItem item={item}
                 key={item.PizzaId} 
                 formatCurrency={formatCurrency} 
                isLoadingIngredients={fetcher.state === 'loading'}
                 ingredients={fetcher?.data?.find((el)=> el.id === item.PizzaId)?.ingredients ?? []}
                 />
              ))}
            </ul>
      <div className="space-y-2 bg-stone-200 px-6 py-5 print:bg-white relative">
        <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className="text-sm 
        font-medium text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
         {!priority && 
         (realstatus === 'prepearing order' || realstatus === 'order placed') &&
          <UpdateOrder order={order} />}
      </div>
     
      <Button type="download"
       onClick={handlePrint} 
       className="bg-red px-2 py-3 print:hidden">Download Receipt⬇️</Button>
       
        <img  className="hidden top-20 print:block h-20 absolute right-0" 
        src="https://shorturl.at/i2jyj" alt="stamp" />
     
    </div>
  );
}

export async function loader({params}){
  const order = await getOrder(params.orderId);
  return order;
}
export default Order;
