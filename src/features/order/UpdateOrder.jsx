import { useFetcher } from "react-router-dom"
import Button from "../../ui/Button"
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({order}) {
    const fetcher = useFetcher();
    
    return (
        <div className=" absolute right-3 bottom-1 print:hidden">
            <fetcher.Form method="PATCH">
                <input type="hidden" name="priorityPrice" value={order.orderPrice * 0.2}/>
                <input type="hidden" name="totalPrice"
                value={order.orderPrice * 0.2 + order.orderPrice}/>
                 
                <Button type="primary">Make Priority</Button>
            </fetcher.Form>
     </div>
    )
};

export async function action({request, params}){
    const formData = await request.formData();
    const data = Object.fromEntries(formData)

    const updatedata = {
        priority : true,
         priorityPrice:data.priorityPrice, 
         totalPrice:data.totalPrice};

    await updateOrder(params.orderId, updatedata)
    return null
}
export default UpdateOrder