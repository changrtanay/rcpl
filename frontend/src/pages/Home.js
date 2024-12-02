import React from 'react'
import CategoryList from '../components/CategoryList'
import Banner from '../components/Banner'
import SmallProductList from '../components/SmallProductList'
import LargeProductList from '../components/LargeProductList'
import HorizontalProductList from '../components/HorizontalProductList'
import VerticalProductList from '../components/VerticalProductList'

const Home = () => {
  
  return (
    <div className='container mx-auto p-4'>
      <CategoryList />
      <Banner />
      {/* <VerticalProductList category={"kurtis"} title={"Kurtis"}/> */}
      <HorizontalProductList category={"kurtis"} title={"Kurtis"}/>
      <HorizontalProductList category={"gowns"} title={"Gowns"}/>
      <HorizontalProductList category={"crop tops"} title={"Crop Tops"}/>
      <HorizontalProductList category={"co-ords"} title={"Co-Ords"}/>
      {/* <SmallProductList category={"airdopes"} title={"Top Airdopes"}/>
      <SmallProductList category={"earphones"} title={"Long Lasting Earphones"}/>
      <LargeProductList category={"camera"} title={"Best Selling Cameras"}/> */}
    </div>

  )
}

export default Home