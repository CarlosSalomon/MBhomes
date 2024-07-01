import '../../../index.scss';

const ProductCard = ({ products, setCurrentProduct }) => {
  return (
        <div className="col-sm-4 mb-4">
          <div className="card tarjeta" style={{width:"auto", minHeight:"240px"}} >
            <div className="card-body tarjeta">
              
            <h5 className="card-title"><u>{products.updatedProduct.title}</u></h5>
              <p className="card-text"><strong>Precio:</strong> ${products.updatedProduct.price}</p>
              <p className="card-text"><strong>Cantidad:</strong> {products.quantity}</p>
              <p className="card-text"><strong>Total:</strong> ${products.amount}</p>
              </div>
          </div>
        </div>
  );
};

export default ProductCard;
