import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  return <h2>Chi tiết sản phẩm ID: {id}</h2>;
};
export default ProductDetail;