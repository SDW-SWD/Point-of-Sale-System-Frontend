'use client'
import Table from "@/app/components/Table"
import page from "@/app/page"
import { Search } from 'lucide-react'
import DetailProduct from "@/app/components/DetalProduct"
import { useQuery } from "@tanstack/react-query"
import getAllProducts from "@/app/api/product_api/api"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProduct } from "@/app/redux/productSlice"
import { RootState } from "@/app/redux/store"
import Loading from "../loading/page"
import { useRouter } from "next/navigation"

const Page = () =>{
  const router=useRouter();
  const [isEnable, setEnabled] = useState(true);
  const dispatch=useDispatch();
  const data=useSelector((state:RootState)=>state.productSlice.customers)
  const {data:productData,isLoading:loading,isError:error}=useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts(),
    retry:2,
    retryDelay:5000,
    enabled:isEnable
  })
  if(loading){
    return <Loading/>
  }
  if(error){
    router.push("/error500")
  }

  useEffect(() => {
    if (productData) {
      const formattedData = productData?.map((element: any) => (
        {
        id: element.id,
        name: element.name,
        category: element.category.name,
        qty: element.quantity,
        desc:element.desc,
        price: element.price,
        button:"Delete"
      }));
      setEnabled(false);
      dispatch(addProduct(formattedData))
      
    }
  }, [productData]);

      return (
       <div className="  flex flex-col min-h-screen w-full ">
        <div className="mt-20  px-24">
          <Table data={data} type="Product" />
        </div>
        <div className="flex w-full justify-center">
        <DetailProduct/>
        </div>
       </div>
      )
}

export default Page