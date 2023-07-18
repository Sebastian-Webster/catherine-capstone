import { REACT_APP_BACKEND_API } from './hooks/config.js';
import { useSyncExternalStore } from 'react';
import { productsStore } from './hooks/productStore.js'
import Header from './componants/public/Header.jsx'
import { useIsLoggedIn } from "./hooks/isLoggedIn";
import { Link } from 'react-router-dom';
import ProductCard from './componants/product/ProductCard';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import bedroom from './assets/bedroom.jpg'

function Shop() {
  
  const products = useSyncExternalStore(productsStore.subscribe, productsStore.getSnapshot)
  const islogin = useIsLoggedIn();
  const userId = JSON.parse(localStorage.getItem("session"));

  if(islogin){
    axios.get(`${REACT_APP_BACKEND_API}/api/user/${userId.userId}`, {withCredentials: true})
    .then(response => console.log(response.data))
  }

  return (
    <>
    <Header />
      <Container style={{backgroundImage: `url(${bedroom}`, backgroundPosition: 'center', backgroundSize:'cover' }} className='text-center py-5' fluid>
        <Row className='py-5'>
          <Col>
            <h1>Shop</h1>
          </Col>
        </Row>
      </Container>

      <Container className='py-5'>
        <Row>
          {products.map(product=>(
            <ProductCard key={product.id} product={product}/>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default Shop
